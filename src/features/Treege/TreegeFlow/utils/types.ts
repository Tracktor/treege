export type FieldType =
  | "text"
  | "number"
  | "email"
  | "file"
  | "password"
  | "tel"
  | "address"
  | "url"
  | "date"
  | "dateRange"
  | "time"
  | "timeRange"
  | "switch"
  | "checkbox"
  | "hidden"
  | "tree"
  | "radio"
  | "select"
  | "autocomplete"
  | "dynamicSelect"
  | "title"
  | "option";

export interface TreeValues {
  id: string;
  label: string;
  value: string;
  message?: string;
}
export interface Params {
  id: string;
  key: string;
  /**
   * (Optional) Static value to be used as a parameter.
   */
  staticValue?: string;
  /**
   * (Optional) Unique identifier for the ancestor node.
   * Example: "ancestorUuid": "123e4567-e89b-12d3-a456-426614174000"
   */
  ancestorUuid?: string;
  useAncestorValue?: boolean;
}
export interface PathKey {
  object?: string;
  value?: string;
  label?: string;
  image?: string;
}
export interface Route {
  url?: string;
  searchKey?: string;
  pathKey?: PathKey;
  params?: Params[];
}
export interface DefaultValueFromAncestor {
  /**
   * (Optional) Unique identifier for the ancestor node.
   */
  uuid?: string;
  /**
   * (Optional) Represents either:
   * - a key path to retrieve a value from the ancestor object (e.g. "address.ZipCode"), or
   * - a literal static value (e.g. "DefaultCountryCode", true, 123).
   */
  sourceValue?: string | number | boolean;
}

export interface TreeNode {
  uuid: string;
  children: TreeNode[];
  treeId?: string;
  treePath?: string;
  childrenTreeRest?: {
    currentTree: TreeNode;
    treePath?: string;
  }[];
  attributes:
    | {
        depth: number;
        tag?: string;
        helperText?: string;
        isDecision?: boolean;
        isLeaf?: boolean;
        isRoot?: boolean;
        label?: string;
        name: string;
        required?: boolean;
        step?: string;
        type: FieldType;
        value?: never;
        values?: TreeValues[];
        defaultValueFromAncestor?: DefaultValueFromAncestor;
        message?: never;
        tree?: TreeNode;
        treePath?: string;
        repeatable?: boolean;
        hiddenValue?: string;
        isDisabledPast?: boolean;
        route?: Route;
        initialQuery?: boolean;
        isMultiple?: boolean;
        pattern?: string;
        patternMessage?: string;
        messages?: {
          on?: string;
          off?: string;
        };
      }
    | {
        depth: number;
        tag?: string;
        helperText?: string;
        messages?: never;
        isDecision?: never;
        isLeaf?: boolean;
        isRoot?: never;
        label?: string;
        name: string;
        required?: never;
        step?: never;
        type?: never;
        value: string;
        values?: never;
        defaultValueFromAncestor?: DefaultValueFromAncestor;
        message?: string;
        tree?: never;
        treePath?: never;
        repeatable?: never;
        hiddenValue?: never;
        isDisabledPast?: boolean;
        route?: Route;
        initialQuery?: boolean;
        isMultiple?: boolean;
        pattern?: string;
        patternMessage?: string;
      };
}

export type Attributes = {
  name: string;
  label: string;
  value: string;
  type?: string;
  isDecision?: boolean;
  sourceHandle?: string;
  message?: string;
};

export type MinimalEdge = {
  uuid: string;
  source: string;
  target: string;
  type?: string;
};

export type TreeNodeData = TreeNode & Record<string, unknown>;

export interface TreeGraph {
  nodes: TreeNode[];
  edges: MinimalEdge[];
}
