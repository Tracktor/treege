import { Node, Edge, Position } from "@xyflow/react";
import { CustomNodeData, MinimalEdge, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

/**
 * Convert MinimalNode → Node ReactFlow
 */
export const toReactFlowNodes = (minimalNodes: MinimalNode[]): Node<CustomNodeData>[] =>
  minimalNodes.map((m) => ({
    data: {
      ...m.attributes,
      children: m.children,
    },
    height: 150,
    id: m.uuid,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    type: m.attributes.type ?? "text",
    width: 200,
  }));

/**
 * Convert MinimalEdge → Edge ReactFlow
 */
export const toReactFlowEdges = (edges: MinimalEdge[]): Edge[] =>
  edges.map((e) => ({
    id: e.uuid,
    source: e.source,
    sourceHandle: `${e.source}-out`,
    target: e.target,
    targetHandle: `${e.target}-in`,
    type: e.type ?? "default",
  }));
