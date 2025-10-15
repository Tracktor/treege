import { Node } from "@xyflow/react";
import { InputNodeData } from "@/shared/types/node";

/**
 * Get field name for an input node (use name or fallback to node ID)
 */
export const getFieldName = (node: Node<InputNodeData>): string => node.data.name || node.id;
