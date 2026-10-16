import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileCode2 } from "lucide-react";
import { files, edges, findFile, incoming, outgoing } from "../data/repository";

export default function HeroGraph() {
  const [selected, setSelected] = useState("services/taskService.ts");
  const file = findFile(selected)!;
  const linked = new Set([
    selected,
    ...incoming(selected).map((e) => e.source),
    ...outgoing(selected).map((e) => e.target),
  ]);
  return (
    <div className="dp-hero-graph">
      <div className="dp-graph-caption">
        <span>
          <span className="dp-dot" /> DISPATCH / MODULE MAP
        </span>
        <span>LOCAL FIXTURE · v1.0</span>
      </div>
      <div className="dp-mini-canvas">
        <svg
          viewBox="-30 -35 1370 500"
          className="dp-mini-edges"
          aria-hidden="true"
        >
          {edges.map((edge) => {
            const a = findFile(edge.source)!.position;
            const b = findFile(edge.target)!.position;
            const active = edge.source === selected || edge.target === selected;
            return (
              <path
                key={edge.id}
                className={active ? "dp-edge-active" : ""}
                d={`M${a.x + 190},${a.y + 45} C${a.x + 235},${a.y + 45} ${b.x - 45},${b.y + 45} ${b.x},${b.y + 45}`}
              />
            );
          })}
        </svg>
        <div className="dp-mini-nodes">
          {files.map((f) => (
            <button
              key={f.id}
              className={`dp-mini-node ${selected === f.id ? "is-selected" : ""} ${linked.has(f.id) ? "" : "is-muted"}`}
              style={{
                left: `${((f.position.x + 30) / 1370) * 100}%`,
                top: `${((f.position.y + 35) / 500) * 100}%`,
              }}
              onClick={() => setSelected(f.id)}
              aria-pressed={selected === f.id}
            >
              <span className="dp-node-layer">{f.layer}</span>
              <strong>
                <FileCode2 size={15} />
                {f.path.split("/").pop()}
              </strong>
              <span className="dp-node-meta">
                {f.symbols.length} exports · TypeScript
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="dp-hero-inspector" aria-live="polite">
        <div>
          <span className="dp-eyebrow">SELECTED MODULE</span>
          <strong>{file.path}</strong>
          <p>{file.description}</p>
        </div>
        <Link
          to={`/devpulse/explore/architecture?file=${encodeURIComponent(file.id)}`}
          className="dp-text-link"
        >
          Inspect source <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="dp-hero-relationships">
        <span>
          Imports{" "}
          {outgoing(selected).length
            ? outgoing(selected).map((edge) => (
                <Link
                  key={edge.id}
                  to={`/devpulse/explore/architecture?file=${encodeURIComponent(edge.target)}`}
                >
                  {edge.target}
                </Link>
              ))
            : "none"}
        </span>
        <span>
          Imported by{" "}
          {incoming(selected).length
            ? incoming(selected).map((edge) => (
                <Link
                  key={edge.id}
                  to={`/devpulse/explore/architecture?file=${encodeURIComponent(edge.source)}&line=${edge.line}`}
                >
                  {edge.source}
                </Link>
              ))
            : "none"}
        </span>
      </div>
      <div className="dp-graph-foot">
        <span>Select a module to trace its relationships</span>
        <span>Edges represent source imports</span>
      </div>
    </div>
  );
}
