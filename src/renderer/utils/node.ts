import { Node } from "@xyflow/react";
import { InputNodeData, TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Filter nodes to get only input nodes
 * @param nodes - Array of nodes to filter
 * @returns Array of input nodes only
 */
export const getInputNodes = (nodes: Node<TreegeNodeData>[]): Node<InputNodeData>[] => nodes.filter(isInputNode) as Node<InputNodeData>[];

/**
 * Get the field name (DOM name attribute) for a given node ID
 * Uses node.data.name if available, otherwise falls back to nodeId
 * @param nodeId - The ID of the input node
 * @param nodes - Array of input nodes
 * @returns The field name to use in the DOM, or undefined if node not found
 */
export const getFieldNameFromNodeId = (nodeId: string, nodes: Node<InputNodeData>[]): string | undefined => {
  const node = nodes.find((n) => n.id === nodeId);
  return node ? node.data.name || node.id : undefined;
};
