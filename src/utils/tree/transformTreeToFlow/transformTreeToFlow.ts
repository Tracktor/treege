import { Edge, Node } from "@xyflow/react";
import { TreeNode } from "@/features/Treege/type/TreeNode";

interface TransformedData {
  nodes: Node[];
  edges: Edge[];
}

interface FlowNode extends Node {
  id: string;
  type: string;
  data: {
    label: string;
    [key: string]: unknown;
  };
  position: {
    x: number;
    y: number;
  };
}

interface FlowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
}

/**
 * Gets node type based on attributes
 */
const getNodeType = (node: TreeNode): string => {
  if (node.attributes.isRoot) return "input";
  if (node.attributes.isLeaf) return "output";
  if (node.attributes.isDecision) return "default";
  return "default";
};

/**
 * Creates a flow node from a tree node
 */
const createFlowNode = (treeNode: TreeNode): FlowNode => ({
  data: {
    label: treeNode.attributes.name || treeNode.attributes.value || "",
    ...treeNode.attributes,
  },
  id: treeNode.uuid,
  position: { x: 0, y: 0 },
  type: getNodeType(treeNode),
});

/**
 * Creates a flow edge between parent and child nodes
 */
const createFlowEdge = (parentId: string, childId: string): FlowEdge => ({
  animated: true,
  id: `e${parentId}-${childId}`,
  source: parentId,
  target: childId,
  type: "smoothstep",
});

/**
 * Recursively transforms a tree node and its children into flow elements
 */
const transformNode = (treeNode: TreeNode, parentId?: string): { nodes: FlowNode[]; edges: FlowEdge[] } => {
  const currentNode = createFlowNode(treeNode);
  const currentEdge = parentId ? [createFlowEdge(parentId, currentNode.id)] : [];

  const childrenTransformations = treeNode.children?.map((child) => transformNode(child, currentNode.id)) || [];

  return {
    edges: [...currentEdge, ...childrenTransformations.flatMap((transform) => transform.edges)],
    nodes: [currentNode, ...childrenTransformations.flatMap((transform) => transform.nodes)],
  };
};

/**
 * Transforms a tree structure into React Flow compatible format
 */
export const transformTreeToFlow = (tree: TreeNode): TransformedData => transformNode(tree);

export default transformTreeToFlow;
