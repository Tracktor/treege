import { Edge, Node } from "@xyflow/react";
import { FormEvent, ReactNode, useCallback, useEffect, useRef } from "react";
import DefaultFormWrapper from "@/renderer/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/components/DefaultInputs";
import { defaultUI } from "@/renderer/components/DefaultUI";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import { FormValues, TreegeRendererComponents } from "@/renderer/types/renderer";
import { NODE_TYPE } from "@/shared/constants/node";
import { TreegeNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";

export type TreegeRendererProps = {
  /**
   * Flow nodes from the editor
   */
  nodes: Node<TreegeNodeData>[];
  /**
   * Flow edges from the editor
   */
  edges: Edge[];
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
};

const TreegeRenderer = ({
  nodes,
  edges,
  validate,
  onSubmit,
  onChange,
  initialValues = {},
  components = {},
  language = "en",
  validationMode = "onSubmit",
}: TreegeRendererProps) => {
  const { formValues, setFieldValue, getFieldValue, errors, setErrors, visibleNodes, topLevelNodes, validateForm } = useTreegeRenderer(
    nodes,
    edges,
    initialValues,
  );

  const FormWrapper = components.form || DefaultFormWrapper;
  const onChangeRef = useRef(onChange);
  const validateRef = useRef(validate);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const formIsValid = validateForm();
      const customErrors = validateRef.current ? validateRef.current(formValues, visibleNodes) : {};
      const isValid = formIsValid && Object.keys(customErrors).length === 0;

      setErrors((prev) => ({ ...prev, ...customErrors }));

      if (isValid && onSubmit) {
        onSubmit(formValues);
      }
    },
    [validateForm, formValues, visibleNodes, onSubmit, setErrors],
  );

  /**
   * Render a single node
   */
  const renderNode = useCallback(
    (node: Node<TreegeNodeData>): ReactNode => {
      const { type } = node;

      switch (type) {
        case NODE_TYPE.input: {
          if (!isInputNode(node)) return null;

          const inputData = node.data;
          const inputType = inputData.type || "text";
          const CustomRenderer = components.inputs?.[inputType];
          const DefaultRenderer = defaultInputRenderers[inputType as keyof typeof defaultInputRenderers];
          const Renderer = CustomRenderer || DefaultRenderer;

          return <Renderer key={node.id} node={node} />;
        }

        case NODE_TYPE.group: {
          if (!isGroupNode(node)) return null;

          const GroupComponent = components.group || DefaultGroup;
          const childNodes = visibleNodes.filter((n) => n.parentId === node.id);

          return (
            <GroupComponent key={node.id} node={node}>
              {childNodes.map((child) => renderNode(child))}
            </GroupComponent>
          );
        }

        case NODE_TYPE.ui: {
          if (!isUINode(node)) return null;

          const uiData = node.data as UINodeData;
          const uiType = uiData.type || "title";
          const CustomRenderer = components.ui?.[uiType];
          const DefaultRenderer = defaultUI[uiType as keyof typeof defaultUI];
          const Renderer = CustomRenderer || DefaultRenderer;

          return <Renderer key={node.id} node={node} />;
        }

        default:
          console.warn("Unknown node type:", type);
          return null;
      }
    },
    [components, visibleNodes],
  );

  /**
   * Keep refs updated to avoid re-creating effects
   */
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /**
   * Keep refs updated to avoid re-creating effects
   */
  useEffect(() => {
    validateRef.current = validate;
  }, [validate]);

  /**
   * Trigger onChange callback when form values change
   */
  useEffect(() => {
    onChangeRef.current?.(formValues);
  }, [formValues]);

  /**
   * Trigger validation when form values change based on validation mode
   */
  useEffect(() => {
    if (validateRef.current && (validationMode === "onChange" || validationMode === "onBlur")) {
      const customErrors = validateRef.current(formValues, visibleNodes);
      setErrors((prev) => ({ ...prev, ...customErrors }));
    }
  }, [formValues, validationMode, visibleNodes, setErrors]);

  return (
    <TreegeRendererProvider
      value={{
        errors,
        formValues,
        getFieldValue,
        language,
        setFieldValue,
      }}
    >
      <FormWrapper onSubmit={handleSubmit}>{topLevelNodes.map((node) => renderNode(node))}</FormWrapper>
    </TreegeRendererProvider>
  );
};

export default TreegeRenderer;
