import { useEffect, useRef, useState } from "react";
import { ArrowRight, RefreshCw, Server } from "lucide-react";
import { api, ApiError } from "../../api/client";
import type { JobPage } from "../../api/contracts";
import { ErrorNotice, Loading } from "./shared";
export default function JobHistory({
  projectId,
  expire,
}: {
  projectId: string;
  expire: () => void;
}) {
  const [data, setData] = useState<JobPage>();
  const [error, setError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const [offset, setOffset] = useState(0);
  const [revision, setRevision] = useState(0);
  const [paused, setPaused] = useState(false);
  const key = useRef<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const poll = async () => {
      try {
        const result = await api.jobs(projectId, controller.signal, offset);
        if (controller.signal.aborted) return;
        setData(result);
        setError(undefined);
        setPaused(false);
        const active = result.items.some((job) =>
          ["queued", "running"].includes(job.status),
        );
        if (active && ++attempts < 60)
          timer = setTimeout(
            () => {
              void poll();
            },
            document.hidden ? 15000 : 5000,
          );
        else if (active) setPaused(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error);
          if (error instanceof ApiError && error.status === 401) expire();
        }
      }
    };
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [projectId, offset, revision, expire]);
  const action = async (jobId?: string) => {
    setBusy(true);
    setError(undefined);
    try {
      if (jobId) await api.cancelJob(projectId, jobId);
      else {
        key.current ??= crypto.randomUUID();
        await api.startJob(projectId, key.current);
        key.current = null;
      }
      setOffset(0);
      setRevision((value) => value + 1);
    } catch (error) {
      setError(error);
      if (error instanceof ApiError && error.status === 401) expire();
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="dp-job-section" aria-labelledby="dp-jobs-title">
      <div className="dp-job-heading">
        <div>
          <span className="dp-eyebrow">SYSTEM / DIAGNOSTICS</span>
          <h2 id="dp-jobs-title">Check the foundations.</h2>
        </div>
        <Server size={25} strokeWidth={1} />
      </div>
      <p>
        A bounded worker checks database, Redis and vector-extension
        connectivity. This does not inspect your repository.
      </p>
      <div className="dp-job-actions">
        <button
          className="dp-button dp-secondary"
          disabled={
            busy ||
            (data?.items.filter((job) =>
              ["queued", "running"].includes(job.status),
            ).length ?? 0) >= 2
          }
          onClick={() => void action()}
        >
          {busy ? "Submitting…" : "Run infrastructure test"}
          <ArrowRight size={15} />
        </button>
        <button
          aria-label="Refresh jobs"
          className="dp-icon-button"
          onClick={() => setRevision((value) => value + 1)}
        >
          <RefreshCw size={16} />
        </button>
      </div>
      <ErrorNotice error={error} />
      {!data && !error && <Loading>Retrieving job history…</Loading>}
      {data?.items.length === 0 && (
        <div className="dp-jobs-empty">
          No infrastructure tests yet. Nothing has been analyzed.
        </div>
      )}
      <div className="dp-job-list">
        {data?.items.map((job) => (
          <article key={job.id} className="dp-job-row">
            <div>
              <span className={`dp-job-status is-${job.status}`}>
                {job.status}
              </span>
              <strong>Infrastructure test</strong>
              <small>
                {new Date(job.created_at).toLocaleString()} · Attempt{" "}
                {job.attempt_count}/3
              </small>
            </div>
            <div className="dp-job-detail">
              <span>{job.stage.replaceAll("_", " ")}</span>
              <progress
                aria-label={`Job ${job.id} progress`}
                value={job.progress}
                max={100}
              />
              <small>
                {job.progress}%
                {job.error_category
                  ? ` · ${job.error_category.replaceAll("_", " ")}`
                  : ""}
              </small>
            </div>
            {["queued", "running"].includes(job.status) && (
              <button
                disabled={busy}
                className="dp-button dp-secondary"
                onClick={() => void action(job.id)}
              >
                Cancel
              </button>
            )}
          </article>
        ))}
      </div>
      {paused && (
        <p role="status">
          Automatic updates paused. Refresh to check again.
        </p>
      )}
      {data && data.total > 20 && (
        <nav className="dp-pagination" aria-label="Job history pages">
          <button
            className="dp-button dp-secondary"
            disabled={offset === 0}
            onClick={() => setOffset((value) => Math.max(0, value - 20))}
          >
            Previous
          </button>
          <span>
            {offset + 1}–{Math.min(offset + 20, data.total)} of {data.total}
          </span>
          <button
            className="dp-button dp-secondary"
            disabled={offset + 20 >= data.total}
            onClick={() => setOffset((value) => value + 20)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
