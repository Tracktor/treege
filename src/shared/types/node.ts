import { Node } from "@xyflow/react";
import { INPUT_TYPE } from "@/shared/constants/inputType";
import { UI_TYPE } from "@/shared/constants/uiType";
import { TranslatableLabel } from "@/shared/types/translate";

export type UIType = (typeof UI_TYPE)[keyof typeof UI_TYPE];
export type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

export type InputOption = {
  /**
   * The value of the option, which will be submitted if selected
   */
  value: string;
  /**
   * The label of the option, which can be translated
   */
  label: TranslatableLabel;
  /**
   * Whether the option is disabled and cannot be selected
   */
  disabled?: boolean;
};

export type BaseNodeData = {
  /**
   * A label for the node, which can be translated
   */
  label?: TranslatableLabel;
};

export type FlowNodeData = BaseNodeData & {
  /**
   * The ID of the target node to connect to
   */
  targetId?: string;
};

export type GroupNodeData = BaseNodeData & {
  /**
   * A label for the group node, which can be translated
   */
  label: TranslatableLabel;
};

export type InputNodeData = BaseNodeData & {
  /**
   * The name of the input field, used for identification and form submission
   */
  name?: string;
  /**
   * The type of input field (e.g., "text", "number", "select", "checkbox")
   */
  type?: InputType;
  /**
   * A sublabel for the input field
   */
  helperText?: string;
  /**
   * Placeholder text for the input field
   */
  placeholder?: string;
  /**
   * Whether the input field is required
   */
  required?: boolean;
  /**
   * A regex pattern that the input value must match
   */
  pattern?: string;
  /**
   * An error message to display if validation fails
   */
  errorMessage?: string;
  /**
   * Options for select, radio, or checkbox input types
   */
  options?: InputOption[];
  /**
   * Whether multiple selections are allowed (for select and checkbox types)
   */
  multiple?: boolean;
  /**
   * The default value config for the input field
   */
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
  /**
   * The JSON string to be processed or displayed
   */
  json?: string;
};

export type UINodeData = BaseNodeData & {
  /**
   * The type of UI component to render (e.g., "button", "text", "image")
   */
  type: UIType;
};

/**
 * Union type representing all possible node data types in the Treege system
 */
export type TreegeNodeData = InputNodeData | UINodeData | FlowNodeData | GroupNodeData | JsonNodeData;

/**
 * A TreegeNode represents a node in the flowchart with specific data and properties
 */
export type TreegeNode = Node<TreegeNodeData>;
