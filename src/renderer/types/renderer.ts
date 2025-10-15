import { Node } from "@xyflow/react";
import { FormEvent, ReactNode } from "react";
import { InputNodeData, TreegeNodeData } from "@/shared/types/node";

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
  inputs?: Partial<Record<string, (props: InputRenderProps) => ReactNode>>;
  /**
   * Custom UI node renderers by UI type
   */
  ui?: Partial<Record<string, (props: NodeRenderProps) => ReactNode>>;
  /**
   * Custom group container renderer
   */
  group?: (props: NodeRenderProps) => ReactNode;
  /**
   * Custom form wrapper
   */
  form?: (props: { children: ReactNode; onSubmit: (e: FormEvent) => void }) => ReactNode;
};
