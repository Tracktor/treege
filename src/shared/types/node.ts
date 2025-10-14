import { Node } from "@xyflow/react";
import { InputOption, InputType } from "@/shared/types/input";
import { TranslatableLabel } from "@/shared/types/translate";

export type BaseNodeData = {
  label?: TranslatableLabel;
};

export type FlowNodeData = BaseNodeData & {
  targetId?: string;
};

export type GroupNodeData = BaseNodeData & {
  label: TranslatableLabel;
};

export type InputNodeData = BaseNodeData & {
  name?: string;
  type?: InputType;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  errorMessage?: string;
  options?: InputOption[];
  multiple?: boolean;
  defaultValue?: null | {
    type?: "static" | "reference";
    staticValue?: string | string[] | boolean;
    referenceField?: string;
    transformFunction?: null | "toString" | "toNumber" | "toBoolean" | "toArray" | "toObject";
    objectMapping?: Array<{
      sourceKey: string;
      targetKey: string;
    }>;
  };
};

export type JsonNodeData = BaseNodeData & {
  json?: string;
};

export type UINodeData = BaseNodeData & {
  type?: string;
};

export type TreegeNodeData = InputNodeData | UINodeData | FlowNodeData | GroupNodeData | JsonNodeData;

export type TreegeNode = Node<TreegeNodeData>;
