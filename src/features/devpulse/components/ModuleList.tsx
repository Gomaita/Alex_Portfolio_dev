import { useState } from "react";
import { FileCode2, Search } from "lucide-react";
import { files, incoming, outgoing } from "../data/repository";

export default function ModuleList({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = files.filter((f) =>
    `${f.path} ${f.layer}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="dp-module-list">
      <label className="dp-search">
        <Search size={16} />
        <input
          aria-label="Filter modules"
          placeholder="Find a module…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span>{filtered.length}</span>
      </label>
      {selected && (
        <a className="dp-source-jump" href="#dp-source">
          Read selected source ↓
        </a>
      )}
      <div className="dp-list-heading">
        <span>MODULE</span>
        <span>IMPORTS / USED BY</span>
      </div>
      {filtered.map((file) => (
        <button
          key={file.id}
          aria-pressed={file.id === selected}
          onClick={() => onSelect(file.id)}
          className={file.id === selected ? "is-selected" : ""}
        >
          <FileCode2 size={17} />
          <span>
            <strong>{file.path}</strong>
            <small>{file.layer}</small>
          </span>
          <span className="dp-module-count">
            {outgoing(file.id).length} / {incoming(file.id).length}
          </span>
        </button>
      ))}
      {!filtered.length && (
        <div className="dp-empty">
          <p>No modules match “{query}”.</p>
          <button
            className="dp-button dp-secondary"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
