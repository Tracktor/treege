import { Node } from "@xyflow/react";
import { FormEvent, ReactNode } from "react";
import { SerializableFile } from "@/renderer/utils/file";
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
  file: SerializableFile | SerializableFile[] | null;
  hidden: string;
  http: string | string[];
  number: number | null;
  password: string;
  radio: string;
  select: string | string[];
  submit: undefined;
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

export type Meta = {
  httpResponse?: unknown;
};

/**
 * Union of all possible input value types
 */
export type InputValue =
  | string
  | number
  | boolean
  | string[]
  | SerializableFile
  | SerializableFile[]
  | [string, string]
  | [string | undefined, string | undefined]
  | null
  | undefined;

/**
 * Props for input components with dynamic value typing
 * All form state is provided via props for easier custom component implementation
 */
export type InputRenderProps<T extends InputType = InputType> = {
  /**
   * The node data for this input field
   */
  node: Node<InputNodeData>;
  /**
   * Current value of the input field (typed based on input type when T is specified)
   */
  value: InputValueTypeMap[T];
  /**
   * Unique field ID (nodeId)
   */
  id: string;
  /**
   * Field name (resolved using priority: name > label > nodeId)
   * Use this for the name and id attributes of the input element
   */
  name: string;
  /**
   * Function to update the input value
   * @param value - The new value (typed based on input type when T is specified)
   */
  setValue: (value: InputValueTypeMap[T]) => void;
  /**
   * Validation error message for this field (if any)
   */
  error?: string;
  /**
   * Translated label (already processed with current language)
   */
  label?: string;
  /**
   * Translated placeholder (already processed with current language)
   */
  placeholder?: string;
  /**
   * Translated helper text (already processed with current language)
   */
  helperText?: string;
  /**
   * Missing required fields on form submit (for submit inputs)
   */
  missingRequiredFields?: string[];
  /**
   * Whether the form is currently being submitted (for submit inputs)
   */
  isSubmitting?: boolean;
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
 * Type-safe input renderers mapping
 * Each input type gets its own properly typed InputRenderProps
 */
export type InputRenderers = {
  [K in InputType]?: (props: InputRenderProps<K>) => ReactNode;
};

/**
 * Custom renderer components
 */
export type TreegeRendererComponents = {
  /**
   * Custom input renderers by input type
   * Each renderer receives properly typed value and setValue based on the input type
   */
  inputs?: InputRenderers;
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
 * Configuration options that can be set globally via TreegeConfigProvider
 * or locally via TreegeRenderer config prop
 */
export type TreegeRendererConfig = {
  /**
   * Custom component renderers
   */
  components?: TreegeRendererComponents;
  /**
   * Google Maps API key for address autocomplete
   * If not provided, falls back to free Nominatim (OpenStreetMap)
   */
  googleApiKey?: string;
  /**
   * Current language for translations
   * @default "en"
   */
  language?: string;
  /**
   * Theme for the renderer
   * @default "dark"
   */
  theme?: "dark" | "light";
  /**
   * Validation mode
   * @default "onSubmit"
   */
  validationMode?: "onChange" | "onSubmit";
};

/**
 * Props for the TreegeRenderer component
 */
export interface TreegeRendererProps {
  /**
   * Additional class name for the renderer container
   */
  className?: string;
  /**
   * Custom component renderers
   */
  components?: TreegeRendererComponents;
  /**
   * Flow or array of flows
   * - If a single Flow: renders that flow
   * - If an array: first flow is the main flow, others are sub-flows available for FlowNodes
   */
  flows?: Flow | Flow[] | null;
  /**
   * Google Maps API key for address autocomplete
   * If not provided, falls back to free Nominatim (OpenStreetMap)
   */
  googleApiKey?: string;
  /**
   * Initial form values
   */
  initialValues?: FormValues;
  /**
   * Current language for translations
   */
  language?: string;
  /**
   * Callback when form values change
   */
  onChange?: (values: FormValues) => void;
  /**
   * Callback when form is submitted
   * @param values - Form values (keyed by field name or node ID)
   * @param meta - Optional metadata about the submission (e.g., HTTP response data)
   */
  onSubmit?: (values: FormValues, meta?: Meta) => void;
  /**
   * Theme for the renderer
   * @default "dark"
   */
  theme?: "dark" | "light";
  /**
   * Custom validation function
   */
  validate?: (values: FormValues, nodes: Node<TreegeNodeData>[]) => Record<string, string>;
  /**
   * Validation mode
   */
  validationMode?: "onChange" | "onSubmit";
}
