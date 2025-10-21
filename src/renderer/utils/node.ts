import { Node } from "@xyflow/react";
import { InputNodeData } from "@/shared/types/node";

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
