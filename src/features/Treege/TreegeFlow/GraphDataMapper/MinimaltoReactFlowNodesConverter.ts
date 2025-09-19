import { Node, Edge, Position } from "@xyflow/react";
import { CustomNodeData, MinimalEdge, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

export const toReactFlowNodes = (minimalNodes: MinimalNode[]): Node<CustomNodeData>[] =>
  minimalNodes.map((m, index) => ({
    data: {
      ...m.attributes,
      options: m.options,
      order: index + 1,
    },
    height: 150,
    id: m.id,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    type: m.attributes.type ?? "text",
    width: 200,
  }));

export const toReactFlowEdges = (minimalEdges: MinimalEdge[]): Edge[] =>
  minimalEdges.map((m) => ({
    id: m.id,
    source: m.source,
    target: m.target,
    type: m.type ?? (m.id.includes("-option-") ? "option" : "default"),
  }));
