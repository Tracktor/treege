import { Edge, Position, Node } from "@xyflow/react";
import { MinimalEdge, MinimalNode } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

/** Convert MinimalNode → Node ReactFlow */
const toReactFlowNodes = (minimalNodes: MinimalNode[]): Node<CustomNodeData>[] =>
  minimalNodes.map((m, index) => ({
    data: {
      ...m.data,
      order: index + 1,
    },
    height: 150,
    id: m.id,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    type: m.data.type ?? "text",
    width: 200,
  }));

/** Convert MinimalEdge → Edge ReactFlow */
const toReactFlowEdges = (minimalEdges: MinimalEdge[]): Edge[] =>
  minimalEdges.map((m) => ({
    id: m.id,
    source: m.source,
    target: m.target,
    type: m.id.includes("-attr-") ? "option" : "default",
  }));

export { toReactFlowNodes, toReactFlowEdges };
