import { Node } from "@xyflow/react";
import { FlowNodeData } from "@/features/Treege/Nodes/FlowNode";
import { GroupNodeData } from "@/features/Treege/Nodes/GroupNode";
import { InputNodeData } from "@/features/Treege/Nodes/InputNode";
import { JsonNodeData } from "@/features/Treege/Nodes/JsonNode";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import { TreegeNode } from "@/type/node";

/**
 * Type guard to check if a node is an InputNode
 * @param node
 */
export const isInputNode = (node: TreegeNode | undefined): node is Node<InputNodeData, "input"> => node?.type === "input";

/**
 * Type guard to check if a node is a UINode
 * @param node
 */
export const isUINode = (node: TreegeNode | undefined): node is Node<UINodeData, "ui"> => node?.type === "ui";

/**
 * Type guard to check if a node is a FlowNode
 * @param node
 */
export const isFlowNode = (node: TreegeNode | undefined): node is Node<FlowNodeData, "flow"> => node?.type === "flow";

/**
 * Type guard to check if a node is a GroupNode
 * @param node
 */
export const isGroupNode = (node: TreegeNode | undefined): node is Node<GroupNodeData, "group"> => node?.type === "group";

/**
 * Type guard to check if a node is a JsonNode
 * @param node
 */
export const isJsonNode = (node: TreegeNode | undefined): node is Node<JsonNodeData, "json"> => node?.type === "json";
