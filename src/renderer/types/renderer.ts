import { Node } from "@xyflow/react";
import { FormEvent, ReactNode } from "react";
import { Flow, InputNodeData, InputType, TreegeNodeData, UINodeData, UIType } from "@/shared/types/node";

/**
 * Type mapping for input values based on input type
 */
export type InputValueTypeMap = {
  address: string;
  autocomplete: string;
  checkbox: boolean | string[];
  date: string;
  daterange: [string, string] | [string | undefined, string | undefined] | null; // [startDate, endDate]
  file: File | File[] | null;
  hidden: string;
  http: string | string[];
  number: number | null;
  password: string;
  radio: string;
  select: string | string[];
  switch: boolean;
  text: string;
  textarea: string;
  time: string; // HH:mm format
  timerange: [string, string] | [string | undefined, string | undefined] | null; // [startTime, endTime]
};

/**
 * Form values stored during rendering
 */
export type FormValues = Record<string, any>;

/**
 * Union of all possible input value types
 */
export type InputValue =
  | string
  | number
  | boolean
  | string[]
  | File
  | File[]
  | [string, string]
  | [string | undefined, string | undefined]
  | null;

/**
 * Props for input components with dynamic value typing
 * All form state is provided via props for easier custom component implementation
 */
export type InputRenderProps<T extends InputType = InputType> = {
  node: Node<InputNodeData>;
  /**
   * Current value of the input field (typed based on input type when T is specified)
   */
  value: InputValueTypeMap[T];
  /**
   * Function to update the input value
   * @param value - The new value (typed based on input type when T is specified)
   */
  setValue: (value: InputValueTypeMap[T]) => void;
  /**
   * Validation error message for this field (if any)
   */
  error?: string;
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
   * Custom submit button (pure button without wrapper)
   */
  submitButton?: (props: { label?: string }) => ReactNode;
  /**
   * Custom submit button wrapper (e.g., for tooltip with missing fields)
   */
  submitButtonWrapper?: (props: { children: ReactNode; missingFields?: string[] }) => ReactNode;
};

/**
 * Props for the TreegeRenderer component
 */
export type TreegeRendererProps = {
  /**
   * Flow or array of flows
   * - If a single Flow: renders that flow
   * - If an array: first flow is the main flow, others are sub-flows available for FlowNodes
   */
  flows?: Flow | Flow[] | null;
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
  validationMode?: "onChange" | "onSubmit";
  /**
   * Custom validation function
   */
  validate?: (values: FormValues, nodes: Node<TreegeNodeData>[]) => Record<string, string>;
  /**
   * Theme for the renderer
   * @default "dark"
   */
  theme?: "dark" | "light";
  /**
   * Google Maps API key for address autocomplete
   * If not provided, falls back to free Nominatim (OpenStreetMap)
   */
  googleApiKey?: string;
};
