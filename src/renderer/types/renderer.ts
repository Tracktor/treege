import { Edge, Node } from "@xyflow/react";
import { FormEvent, ReactNode } from "react";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { InputNodeData, InputType, TreegeNodeData, UINodeData, UIType } from "@/shared/types/node";

/**
 * Form values stored during rendering
 */
export type FormValues = Record<string, any>;

/**
 * Props for input components (use useTreegeContext for form state)
 */
export type InputRenderProps = {
  node: Node<InputNodeData>;
};

export type UiRenderProps = {
  node: Node<UINodeData>;
};

/**
 * Props for UI/Group components (use useTreegeContext for state)
 */
export type NodeRenderProps = {
  node: Node<TreegeNodeData>;
};

/**
 * Custom renderer components
 */
export type TreegeRendererComponents = {
  /**
   * Custom input renderers by input type
   */
  inputs?: Partial<Record<InputType, (props: InputRenderProps) => ReactNode>>;
  /**
   * Custom UI node renderers by UI type
   */
  ui?: Partial<Record<UIType, (props: NodeRenderProps) => ReactNode>>;
  /**
   * Custom group container renderer
   */
  group?: (props: NodeRenderProps) => ReactNode;
  /**
   * Custom form wrapper
   */
  form?: (props: { children: ReactNode; onSubmit: (e: FormEvent) => void }) => ReactNode;
  /**
   * Custom submit button
   * @param props
   */
  submitButton?: (props: { label?: string }) => ReactNode;
};

/**
 * Props for the TreegeRenderer component
 */
export type TreegeRendererProps = {
  /**
   * Flow nodes from the editor
   */
  nodes: Node<TreegeNodeData>[];
  /**
   * Flow edges from the editor
   */
  edges: Edge[] | Edge<ConditionalEdgeData>[];
  /**
   * Initial form values
   */
  initialValues?: FormValues;
  /**
   * Callback when form is submitted
   */
  onSubmit?: (values: FormValues) => void;
  /**
   * Callback when form values change
   */
  onChange?: (values: FormValues) => void;
  /**
   * Custom component renderers
   */
  components?: TreegeRendererComponents;
  /**
   * Current language for translations
   */
  language?: string;
  /**
   * Validation mode
   */
  validationMode?: "onChange" | "onBlur" | "onSubmit";
  /**
   * Custom validation function
   */
  validate?: (values: FormValues, nodes: Node<TreegeNodeData>[]) => Record<string, string>;
  /**
   * Theme for the renderer (controlled mode)
   * The renderer will apply this theme directly without managing its own state
   * @default "dark"
   */
  theme?: "dark" | "light";
};
