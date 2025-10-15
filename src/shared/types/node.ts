import { Node } from "@xyflow/react";
import { INPUT_TYPE } from "@/shared/constants/inputType";
import { UI_TYPE } from "@/shared/constants/uiType";
import { TranslatableLabel } from "@/shared/types/translate";

export type UIType = (typeof UI_TYPE)[keyof typeof UI_TYPE];
export type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

export type InputOption = {
  value: string;
  label: TranslatableLabel;
  disabled?: boolean;
};

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
  type: UIType;
};

export type TreegeNodeData = InputNodeData | UINodeData | FlowNodeData | GroupNodeData | JsonNodeData;

export type TreegeNode = Node<TreegeNodeData>;
