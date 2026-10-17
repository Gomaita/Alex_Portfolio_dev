import { describe, expect, it, vi } from "vitest";
import { ApiError, createApi } from "../api/client";

describe("private API client", () => {
  it("fails explicitly without configuration and never falls back to sample data", async () => {
    const fetcher = vi.fn();
    await expect(createApi("", fetcher).projects()).rejects.toMatchObject({
      code: "not_configured",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("uses cookies, CSRF, typed bodies and a request-specific idempotency key", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ csrf_token: "csrf" }))
      .mockResolvedValue(Response.json({ id: "job" }));
    const client = createApi("https://api.test/api/v1/", fetcher);
    await client.me();
    await client.startJob("project", "idempotency-key");
    const [url, options] = fetcher.mock.calls[1];
    expect(url).toBe("https://api.test/api/v1/projects/project/jobs");
    expect(options.credentials).toBe("include");
    expect(options.headers.get("X-CSRF-Token")).toBe("csrf");
    expect(options.headers.get("Idempotency-Key")).toBe("idempotency-key");
    expect(JSON.parse(options.body)).toEqual({ job_type: "diagnostic" });
  });
  it("retries GET once but never repeats a project write", async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValue(Response.json({ items: [], total: 0 }));
    await createApi("https://api.test", fetcher).projects();
    expect(fetcher).toHaveBeenCalledTimes(2);
    fetcher.mockReset().mockRejectedValue(new TypeError("offline"));
    await expect(
      createApi("https://api.test", fetcher).create({ name: "Project" }),
    ).rejects.toMatchObject({ code: "network_error" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("normalizes errors without exposing raw responses and clears expired CSRF", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ csrf_token: "csrf" }))
      .mockResolvedValueOnce(
        Response.json(
          {
            error: {
              code: "session_expired",
              message: "Sign in again.",
              request_id: "request",
            },
          },
          { status: 401 },
        ),
      )
      .mockResolvedValue(new Response(null, { status: 204 }));
    const client = createApi("https://api.test", fetcher);
    await client.me();
    await expect(client.projects()).rejects.toMatchObject({
      status: 401,
      requestId: "request",
    });
    await client.remove("project");
    expect(fetcher.mock.calls[2][1].headers.get("X-CSRF-Token")).toBe("");
  });
  it("propagates cancellation without retrying", async () => {
    const controller = new AbortController();
    const fetcher = vi.fn().mockImplementation(() => {
      controller.abort();
      return Promise.reject(new DOMException("Aborted", "AbortError"));
    });
    await expect(
      createApi("https://api.test", fetcher).projects("", 0, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("preserves safe validation errors", async () => {
    const client = createApi(
      "https://api.test",
      vi
        .fn()
        .mockResolvedValue(
          Response.json(
            { error: { code: "validation_error", message: "Check fields." } },
            { status: 422 },
          ),
        ),
    );
    await expect(client.create({ name: "" })).rejects.toBeInstanceOf(ApiError);
  });
});
