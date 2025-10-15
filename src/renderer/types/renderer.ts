import { Node } from "@xyflow/react";
import { FormEvent, ReactNode } from "react";
import { InputNodeData, TreegeNodeData } from "@/shared/types/node";

/**
 * Form values stored during rendering
 */
export type FormValues = Record<string, any>;

/**
 * Context passed to render props functions
 */
export type RenderContext = {
  formValues: FormValues;
  setFieldValue: (fieldName: string, value: any) => void;
  getFieldValue: (fieldName: string) => any;
  errors: Record<string, string>;
  language: string;
};

/**
 * Props for custom input component render
 */
export type InputRenderProps = {
  node: Node<InputNodeData>;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  context: RenderContext;
};

/**
 * Props for custom group component render
 */
export type GroupRenderProps = {
  node: Node<TreegeNodeData>;
  children: ReactNode;
  context: RenderContext;
};

/**
 * Props for custom UI component render
 */
export type UIRenderProps = {
  node: Node<TreegeNodeData>;
  context: RenderContext;
};

/**
 * Props for custom JSON component render
 */
export type JsonRenderProps = {
  node: Node<TreegeNodeData>;
  data: any;
  context: RenderContext;
};

/**
 * Custom renderer functions for each node type
 */
export type TreegeRendererComponents = {
  /**
   * Custom input renderer by input type
   * Example: { text: (props) => <MyTextInput {...props} /> }
   */
  inputs?: Partial<Record<string, (props: InputRenderProps) => ReactNode>>;
  /**
   * Custom group container renderer
   */
  group?: (props: GroupRenderProps) => ReactNode;
  /**
   * Custom UI node renderer by type
   */
  ui?: Partial<Record<string, (props: UIRenderProps) => ReactNode>>;
  /**
   * Custom JSON node renderer
   */
  json?: (props: JsonRenderProps) => ReactNode;
  /**
   * Custom form wrapper
   */
  form?: (props: { children: ReactNode; onSubmit: (e: FormEvent) => void }) => ReactNode;
};

/**
 * Processed node ready for rendering with visibility state
 */
export type ProcessedNode = {
  node: Node<TreegeNodeData>;
  visible: boolean;
  children?: ProcessedNode[];
};
