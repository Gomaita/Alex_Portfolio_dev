import { lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Box,
  GitBranch,
  Layers3,
  Files,
  Braces,
  Fingerprint,
} from "lucide-react";
import { findFile, metrics, repository } from "../data/repository";
import Inspector from "../components/Inspector";
import ModuleList from "../components/ModuleList";

const ArchitectureGraph = lazy(() => import("../components/ArchitectureGraph"));
export default function Workspace({
  architecture = false,
}: {
  architecture?: boolean;
}) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("file");
  const file = findFile(
    requested ?? (architecture ? null : "services/taskService.ts"),
  );
  const lineValue = Number(params.get("line"));
  const line =
    file &&
    Number.isInteger(lineValue) &&
    lineValue > 0 &&
    lineValue <= file.lines
      ? lineValue
      : undefined;
  function select(id: string | null, nextLine?: number) {
    const next = new URLSearchParams();
    if (id) next.set("file", id);
    if (nextLine) next.set("line", String(nextLine));
    setParams(next, { preventScrollReset: true });
  }
  return (
    <div className="dp-workspace">
      <div className="dp-sample-banner">
        <span className="dp-tag">SAMPLE MODE</span>
        <span>First-party local fixture. No live scan or AI analysis.</span>
        <a href="#dp-provenance">
          View provenance <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="dp-work-heading">
        <div>
          <div className="dp-breadcrumb">
            <Link to="/devpulse">DevPulse</Link>
            <span>/</span>
            <Link to="/devpulse/explore">dispatch</Link>
            {architecture && (
              <>
                <span>/</span>
                <span>architecture</span>
              </>
            )}
          </div>
          <h1 tabIndex={-1}>
            {architecture
              ? "Architecture explorer"
              : "A small codebase. The full picture."}
          </h1>
          <p>
            {architecture
              ? "Follow the imports. Inspect the boundaries. Read the source."
              : repository.repository.description}
          </p>
        </div>
        <span className="dp-snapshot">
          <Fingerprint size={17} />
          {repository.snapshotHash.slice(0, 12)}
          <small>content snapshot</small>
        </span>
      </div>
      {!architecture && (
        <>
          <div className="dp-repo-heading">
            <div className="dp-repo-icon">
              <Box size={26} />
            </div>
            <div>
              <h2>
                dispatch<span className="dp-tag">v1.0.0</span>
              </h2>
              <p>
                TypeScript task application · in-memory storage · no runtime
                dependencies
              </p>
            </div>
            <Link
              className="dp-button dp-secondary"
              to="/devpulse/explore/architecture"
            >
              Explore architecture <ArrowUpRight size={16} />
            </Link>
          </div>
          <dl className="dp-metrics">
            {[
              [Files, metrics.files, "Source modules"],
              [GitBranch, metrics.imports, "Import relationships"],
              [Braces, metrics.symbols, "Top-level symbols"],
              [Layers3, metrics.lines, "Source lines"],
            ].map(([Icon, value, label]) => {
              const MetricIcon = Icon as typeof Files;
              return (
                <div key={String(label)}>
                  <dt>
                    <MetricIcon size={16} />
                    {String(label)}
                  </dt>
                  <dd>{String(value).padStart(2, "0")}</dd>
                </div>
              );
            })}
          </dl>
        </>
      )}
      <div
        className={`dp-work-grid ${architecture ? "dp-architecture-grid" : ""}`}
      >
        <div className="dp-work-primary">
          {architecture ? (
            <Suspense
              fallback={
                <div className="dp-graph-loading" role="status">
                  Loading architecture explorer…
                </div>
              }
            >
              <ArchitectureGraph
                selected={file?.id ?? null}
                onSelect={select}
              />
            </Suspense>
          ) : (
            <div className="dp-panel-heading">
              <span className="dp-eyebrow">REPOSITORY FILES</span>
              <span>7 / 7 included</span>
            </div>
          )}
          <ModuleList selected={file?.id ?? null} onSelect={select} />
          {architecture && (
            <p className="dp-fine">
              Accessible alternative: select any module in the list to inspect
              incoming and outgoing relationships. Dashed edges are type-only
              imports.
            </p>
          )}
        </div>
        <div id="dp-source" className="dp-work-inspector">
          {file ? (
            <Inspector
              key={file.id}
              file={file}
              line={line}
              onSelect={select}
              onLine={(value) => select(file.id, value)}
            />
          ) : (
            <div className="dp-inspector-empty">
              <GitBranch size={38} />
              <span className="dp-eyebrow">FOLLOW A CONNECTION</span>
              <h2>
                {requested
                  ? "Module not found"
                  : "The details are in the code."}
              </h2>
              <p>
                {requested
                  ? "This file is not part of the bundled snapshot. Select a module from the graph or list."
                  : "Select a module to inspect its source, declarations and import relationships."}
              </p>
              <button
                className="dp-button dp-secondary"
                onClick={() => select("services/taskService.ts")}
              >
                Inspect the service <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <section id="dp-provenance" className="dp-provenance">
        <Fingerprint size={20} />
        <div>
          <h2>A sample you can verify.</h2>
          <p>
            {repository.repository.provenance}. Module descriptions are authored
            documentation; structure is generated with the TypeScript parser.
            SHA-256 hashes identify the exact normalized source. This is an
            import map, not a call graph.
          </p>
          <details>
            <summary>Snapshot and reproduction</summary>
            <code>{repository.snapshotHash}</code>
            <p>
              Source: src/features/devpulse/fixture
              <br />
              Regenerate: npm run devpulse:fixture
              <br />
              Verify: npm run devpulse:fixture:check
            </p>
          </details>
        </div>
        <span className="dp-tag">LOCAL · READ ONLY</span>
      </section>
    </div>
  );
}
