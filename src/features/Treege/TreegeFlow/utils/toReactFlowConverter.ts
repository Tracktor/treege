import { Node, Edge, Position } from "@xyflow/react";
import { TreeNode, TreeNodeData, TreeEdge } from "@/features/Treege/TreegeFlow/utils/types";

/**
 * Convert TreeNode[] → Node ReactFlow
 */
export const toReactFlowNodes = (treeNodes: TreeNode[]): Node<TreeNodeData>[] =>
  treeNodes.map((node) => ({
    data: {
      ...node,
    },
    height: 150,
    id: node.uuid,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    type: "type" in node.attributes ? node.attributes.type : "option",
    width: 200,
  }));

/**
 * Convert TreeEdge[] → Edge ReactFlow
 */
export const toReactFlowEdges = (edges: TreeEdge[]): Edge[] =>
  edges.map((e) => ({
    id: e.uuid,
    source: e.source,
    sourceHandle: `${e.source}-out`,
    target: e.target,
    targetHandle: `${e.target}-in`,
    type: e.type ?? "default",
  }));
