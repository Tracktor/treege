import { Node } from "@xyflow/react";
import { FlowNodeData } from "@/features/Treege/Nodes/FlowNode";
import { GroupNodeData } from "@/features/Treege/Nodes/GroupNode";
import { InputNodeData } from "@/features/Treege/Nodes/InputNode";
import { JsonNodeData } from "@/features/Treege/Nodes/JsonNode";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import { TranslatableLabel } from "@/type/translate";

export type BaseNodeData = {
  label?: TranslatableLabel;
};

export type TreegeNodeData = InputNodeData | UINodeData | FlowNodeData | GroupNodeData | JsonNodeData;

export type TreegeNode = Node<TreegeNodeData>;
