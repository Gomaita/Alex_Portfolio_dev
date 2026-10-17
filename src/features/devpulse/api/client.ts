import type {
  JobInput,
  JobPage,
  JobView,
  Me,
  ProjectInput,
  ProjectPage,
  ProjectPatch,
  ProjectView,
} from "./contracts";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApi(base: string, fetcher: typeof fetch = fetch) {
  let csrf = "";
  const origin = base.replace(/\/$/, "");
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    if (!origin)
      throw new ApiError(
        0,
        "not_configured",
        "The private workspace is not connected yet.",
      );
    const method = options.method ?? "GET";
    const headers = new Headers(options.headers);
    if (options.body) headers.set("Content-Type", "application/json");
    if (method !== "GET") headers.set("X-CSRF-Token", csrf);
    const signal = AbortSignal.any([
      options.signal ?? new AbortController().signal,
      AbortSignal.timeout(10000),
    ]);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise<void>((resolve, reject) => {
            const abort = () => {
              clearTimeout(timer);
              reject(signal.reason);
            };
            const timer = setTimeout(() => {
              signal.removeEventListener("abort", abort);
              resolve();
            }, 250);
            if (signal.aborted) abort();
            else signal.addEventListener("abort", abort, { once: true });
          });
        }
        const response = await fetcher(origin + path, {
          ...options,
          method,
          headers,
          credentials: "include",
          signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const error = new ApiError(
            response.status,
            payload?.error?.code ?? "request_failed",
            payload?.error?.message ?? "The request could not be completed.",
            payload?.error?.request_id,
          );
          if (response.status === 401) csrf = "";
          if (method === "GET" && response.status === 503 && attempt === 0)
            continue;
          throw error;
        }
        return response.status === 204
          ? (undefined as T)
          : ((await response.json()) as T);
      } catch (error) {
        if (options.signal?.aborted) throw error;
        if (error instanceof ApiError) throw error;
        if (method === "GET" && attempt === 0 && !signal.aborted) continue;
        throw new ApiError(
          0,
          signal.aborted ? "timeout" : "network_error",
          signal.aborted
            ? "The service took too long to respond. Please retry."
            : "Unable to reach the service. Your changes have not been confirmed.",
        );
      }
    }
    throw new ApiError(0, "network_error", "Unable to reach the service.");
  }
  return {
    configured: !!origin,
    loginUrl: origin + "/auth/login",
    async me(signal?: AbortSignal) {
      const me = await request<Me>("/me", { signal });
      csrf = me.csrf_token;
      return me;
    },
    async logout() {
      await request<void>("/auth/logout", { method: "POST" });
      csrf = "";
    },
    projects(search = "", offset = 0, signal?: AbortSignal) {
      return request<ProjectPage>(
        `/projects?limit=12&offset=${offset}&search=${encodeURIComponent(search)}`,
        { signal },
      );
    },
    project(id: string, signal?: AbortSignal) {
      return request<ProjectView>(`/projects/${encodeURIComponent(id)}`, {
        signal,
      });
    },
    create(data: ProjectInput) {
      return request<ProjectView>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: ProjectPatch) {
      return request<ProjectView>(`/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    remove(id: string) {
      return request<void>(`/projects/${id}`, { method: "DELETE" });
    },
    jobs(id: string, signal?: AbortSignal, offset = 0) {
      return request<JobPage>(
        `/projects/${id}/jobs?limit=20&offset=${offset}`,
        { signal },
      );
    },
    startJob(id: string, key: string) {
      const body: JobInput = { job_type: "diagnostic" };
      return request<JobView>(`/projects/${id}/jobs`, {
        method: "POST",
        headers: { "Idempotency-Key": key },
        body: JSON.stringify(body),
      });
    },
    cancelJob(id: string, job: string) {
      return request<JobView>(`/projects/${id}/jobs/${job}/cancel`, {
        method: "POST",
      });
    },
  };
}

export const api = createApi(import.meta.env.VITE_DEVPULSE_API_BASE_URL ?? "");
