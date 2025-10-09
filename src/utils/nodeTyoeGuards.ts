import { Node } from "@xyflow/react";
import { FlowNodeData } from "@/features/Treege/Nodes/FlowNode";
import { GroupNodeData } from "@/features/Treege/Nodes/GroupNode";
import { InputNodeData } from "@/features/Treege/Nodes/InputNode";
import { JsonNodeData } from "@/features/Treege/Nodes/JsonNode";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import { TreegeNode } from "@/type/node";

export const isInputNode = (node: TreegeNode | undefined): node is Node<InputNodeData, "input"> => node?.type === "input";

export const isUINode = (node: TreegeNode | undefined): node is Node<UINodeData, "ui"> => node?.type === "ui";

export const isFlowNode = (node: TreegeNode | undefined): node is Node<FlowNodeData, "flow"> => node?.type === "flow";

export const isGroupNode = (node: TreegeNode | undefined): node is Node<GroupNodeData, "group"> => node?.type === "group";

export const isJsonNode = (node: TreegeNode | undefined): node is Node<JsonNodeData, "json"> => node?.type === "json";
