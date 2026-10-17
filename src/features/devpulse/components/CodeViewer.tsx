import { useEffect, useRef, useState, type ReactNode } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import { Copy, WrapText } from "lucide-react";
import type { SourceFile } from "../data/types";

function renderToken(token: string | Prism.Token, key: number): ReactNode {
  if (typeof token === "string") return token;
  const content = Array.isArray(token.content)
    ? token.content.map(renderToken)
    : typeof token.content === "string"
      ? token.content
      : renderToken(token.content, 0);
  return (
    <span key={key} className={`dp-token-${token.type}`}>
      {content}
    </span>
  );
}
export default function CodeViewer({
  file,
  highlight,
}: {
  file: SourceFile;
  highlight?: number;
}) {
  const [copyState, setCopyState] = useState("Copy source");
  const [wrap, setWrap] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scroll.current;
    const target = container?.querySelector<HTMLElement>(
      `[data-line="${highlight}"]`,
    );
    if (container && target)
      container.scrollTop = target.offsetTop - 32;
  }, [highlight]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(file.source);
      setCopyState("Copied");
    } catch {
      setCopyState("Copy unavailable — select source manually");
    }
  }
  return (
    <section
      className="dp-code-viewer"
      aria-label={`Source code for ${file.path}`}
    >
      <div className="dp-code-toolbar">
        <span>
          TS <b>{file.path}</b>
        </span>
        <div>
          <button
            className="dp-icon-button"
            aria-label="Toggle code wrapping"
            aria-pressed={wrap}
            onClick={() => setWrap(!wrap)}
          >
            <WrapText size={17} />
          </button>
          <button
            className="dp-icon-button"
            onClick={copy}
            aria-label="Copy source"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scroll}
        className="dp-code-scroll"
        tabIndex={0}
        aria-label="Scrollable TypeScript source"
      >
        <pre className={wrap ? "dp-code-wrap" : ""}>
          <code>
            {file.source
              .trimEnd()
              .split("\n")
              .map((line, i) => (
                <span
                  key={i}
                  className={`dp-code-line ${highlight === i + 1 ? "is-highlighted" : ""}`}
                  data-line={i + 1}
                >
                  <span className="dp-line-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    {Prism.tokenize(line, Prism.languages.typescript).map(
                      renderToken,
                    )}
                    {"\n"}
                  </span>
                </span>
              ))}
          </code>
        </pre>
      </div>
      <div className="dp-code-footer">
        <span>TypeScript · {file.lines} lines · read only</span>
        <span role="status">
          {copyState === "Copy source" ? "Original fixture source" : copyState}
        </span>
      </div>
    </section>
  );
}
