import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../../api/client";
export function ErrorNotice({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <div className="dp-live-error" role="alert">
      <strong>
        {error instanceof Error
          ? error.message
          : "Something went wrong. Please retry."}
      </strong>
      {error instanceof ApiError && error.requestId && (
        <small>Request {error.requestId}</small>
      )}
    </div>
  );
}
export function Loading({
  children = "Loading your workspace…",
}: {
  children?: ReactNode;
}) {
  return (
    <div className="dp-live-loading" role="status">
      <span className="dp-live-loading-line" />
      {children}
    </div>
  );
}
export function useRequest<T>(
  load: (signal: AbortSignal) => Promise<T>,
  keys: (string | number)[],
) {
  const [state, setState] = useState<{
    data?: T;
    error?: unknown;
    loading: boolean;
  }>({ loading: true });
  const [revision, refresh] = useState(0);
  const loader = useRef(load);
  useEffect(() => {
    loader.current = load;
  });
  const key = JSON.stringify(keys);
  useEffect(() => {
    const controller = new AbortController();
    // Clear previous private data on identity/route changes.
    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) setState({ loading: true });
    });
    loader
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ error, loading: false });
      });
    return () => controller.abort();
  }, [key, revision]);
  const reload = useCallback(() => refresh((value) => value + 1), []);
  return { ...state, refresh: reload };
}
