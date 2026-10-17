import { lazy, Suspense } from "react";
import { ArrowDownLeft, ArrowUpRight, FileCode2 } from "lucide-react";
import { incoming, outgoing } from "../data/repository";
import type { SourceFile } from "../data/types";

const CodeViewer = lazy(() => import("./CodeViewer"));
export default function Inspector({
  file,
  onSelect,
  line,
  onLine,
}: {
  file: SourceFile;
  onSelect: (id: string, line?: number) => void;
  line?: number;
  onLine: (line: number) => void;
}) {
  const dependencies = outgoing(file.id);
  const dependents = incoming(file.id);
  return (
    <section className="dp-inspector" aria-label="Module inspector">
      <div className="dp-inspector-heading">
        <span className="dp-eyebrow">SOURCE INSPECTOR</span>
        <span className="dp-tag">{file.layer}</span>
      </div>
      <h2>
        <FileCode2 size={21} />
        {file.path.split("/").pop()}
      </h2>
      <p>{file.description}</p>
      <div className="dp-file-meta">
        <span>{file.lines} lines</span>
        <span>{file.symbols.length} symbols</span>
        <span title={file.sha256}>SHA256 {file.sha256.slice(0, 8)}</span>
      </div>
      <div className="dp-symbols" aria-label="Symbols">
        {file.symbols.map((symbol) => (
          <button
            key={symbol.name}
            onClick={() => onLine(symbol.startLine)}
            aria-pressed={line === symbol.startLine}
          >
            <span>ƒ</span>
            {symbol.name}
            <small>
              L{symbol.startLine}–{symbol.endLine}
            </small>
          </button>
        ))}
      </div>
      <Suspense
        fallback={
          <div className="dp-loading" role="status">
            Loading source viewer…
          </div>
        }
      >
        <CodeViewer key={file.id} file={file} highlight={line} />
      </Suspense>
      <div className="dp-relations">
        <div>
          <h3>
            <ArrowUpRight size={15} /> Imports{" "}
            <span>{dependencies.length}</span>
          </h3>
          {dependencies.length ? (
            dependencies.map((edge) => (
              <button key={edge.id} onClick={() => onSelect(edge.target)}>
                <span>{edge.target}</span>
                <small>
                  {edge.kind === "type-import" ? "type · " : ""}L{edge.line} ↗
                </small>
              </button>
            ))
          ) : (
            <p>No outgoing imports.</p>
          )}
        </div>
        <div>
          <h3>
            <ArrowDownLeft size={15} /> Imported by{" "}
            <span>{dependents.length}</span>
          </h3>
          {dependents.length ? (
            dependents.map((edge) => (
              <button
                key={edge.id}
                onClick={() => onSelect(edge.source, edge.line)}
              >
                <span>{edge.source}</span>
                <small>L{edge.line} ↗</small>
              </button>
            ))
          ) : (
            <p>No incoming imports.</p>
          )}
        </div>
      </div>
      <p className="dp-fine">
        Descriptions are authored fixture documentation. No AI analysis has been
        performed.
      </p>
    </section>
  );
}
