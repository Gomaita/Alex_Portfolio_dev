import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
  type NodeProps,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import { useReducedMotion } from "framer-motion";
import { FileCode2, Maximize, Minus, Plus, RotateCcw } from "lucide-react";
import { files, edges, incoming, outgoing } from "../data/repository";
import type { SourceFile } from "../data/types";
import "@xyflow/react/dist/style.css";

type ModuleNode = Node<{ file: SourceFile; dimmed: boolean }, "module">;
function Module({ data, selected }: NodeProps<ModuleNode>) {
  return (
    <div
      className={`dp-flow-node ${selected ? "is-selected" : ""} ${data.dimmed ? "is-muted" : ""}`}
    >
      <Handle type="target" position={Position.Left} />
      <span className="dp-node-layer">{data.file.layer}</span>
      <strong>
        <FileCode2 size={17} />
        {data.file.path.split("/").pop()}
      </strong>
      <span className="dp-node-meta">
        {data.file.lines} lines <span>TS</span>
      </span>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
const nodeTypes = { module: Module };
export default function ArchitectureGraph({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [instance, setInstance] =
    useState<ReactFlowInstance<ModuleNode> | null>(null);
  const reduced = useReducedMotion();
  const related = useMemo(
    () =>
      new Set(
        selected
          ? [
              selected,
              ...incoming(selected).map((e) => e.source),
              ...outgoing(selected).map((e) => e.target),
            ]
          : files.map((f) => f.id),
      ),
    [selected],
  );
  const nodes: ModuleNode[] = files.map((file) => ({
    id: file.id,
    type: "module",
    position: file.position,
    data: { file, dimmed: !related.has(file.id) },
    selected: selected === file.id,
    ariaLabel: `${file.path}, ${file.layer}. Select to inspect source.`,
  }));
  const graphEdges = edges.map((edge) => {
    const direction =
      edge.source === selected
        ? "outgoing"
        : edge.target === selected
          ? "incoming"
          : "neutral";
    const color =
      direction === "outgoing"
        ? "#61d6ee"
        : direction === "incoming"
          ? "#e6bc7a"
          : "#66717e";
    return {
      ...edge,
      type: "smoothstep",
      className: `dp-flow-edge dp-${direction}`,
      markerEnd: { type: MarkerType.ArrowClosed, color },
      style: {
        stroke: color,
        strokeWidth: direction === "neutral" ? 1.3 : 2,
        opacity: selected && direction === "neutral" ? 0.25 : 1,
        strokeDasharray: edge.kind === "type-import" ? "5 4" : undefined,
      },
    };
  });
  const duration = reduced ? 0 : 220;
  return (
    <div className="dp-flow-frame">
      <div className="dp-flow-top">
        <span className="dp-eyebrow">IMPORT GRAPH</span>
        <span>Drag canvas to pan · scroll to zoom</span>
      </div>
      <div
        className="dp-flow-canvas"
        aria-label="Interactive module dependency graph"
        onKeyDownCapture={(event) => {
          const node = (event.target as HTMLElement).closest<HTMLElement>(
            ".react-flow__node",
          );
          if (node && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            event.stopPropagation();
            onSelect(node.dataset.id ?? null);
          }
        }}
      >
        <ReactFlow<ModuleNode>
          nodes={nodes}
          edges={graphEdges}
          nodeTypes={nodeTypes}
          onInit={setInstance}
          onNodeClick={(_, node) => onSelect(node.id)}
          onPaneClick={() => onSelect(null)}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesFocusable={false}
          deleteKeyCode={null}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.2}
          maxZoom={1.8}
          colorMode="dark"
          preventScrolling={false}
          ariaLabelConfig={{
            "node.a11yDescription.default":
              "Press Enter or Space to inspect a module. A searchable module list is also available below.",
          }}
        >
          <Background color="#34404b" gap={24} size={1} />
        </ReactFlow>
      </div>
      <div className="dp-flow-bottom">
        <div className="dp-graph-controls">
          <button
            aria-label="Zoom out"
            onClick={() => instance?.zoomOut({ duration })}
          >
            <Minus size={17} />
          </button>
          <button
            aria-label="Zoom in"
            onClick={() => instance?.zoomIn({ duration })}
          >
            <Plus size={17} />
          </button>
          <button
            aria-label="Fit graph to view"
            onClick={() => instance?.fitView({ duration, padding: 0.12 })}
          >
            <Maximize size={17} />
          </button>
          <button
            aria-label="Reset graph selection"
            onClick={() => {
              onSelect(null);
              void instance?.fitView({ duration, padding: 0.12 });
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="dp-legend">
          <span>
            <i />
            Imports
          </span>
          <span>
            <i />
            Imported by
          </span>
          <span>→ import direction</span>
        </div>
      </div>
    </div>
  );
}
