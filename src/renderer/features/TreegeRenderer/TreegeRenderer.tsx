import { Edge, Node } from "@xyflow/react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { DefaultFormWrapper, DefaultGroup, DefaultUI } from "@/renderer/components/DefaultComponents";
import { defaultInputRenderers } from "@/renderer/components/DefaultInputs";
import { useTreegeForm } from "@/renderer/hooks/useTreegeForm";
import { FormValues, ProcessedNode, RenderContext, TreegeRendererComponents } from "@/renderer/types/renderer";
import { InputNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";

export type TreegeRendererProps = {
  /**
   * Flow nodes from the editor
   */
  nodes: Node[];
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
   * Custom component renderers (render props pattern)
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
  validate?: (values: FormValues, nodes: Node[]) => Record<string, string>;
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
  const { formValues, setFieldValue, getFieldValue, errors, setErrors, processedNodes, visibleNodes, validateForm } = useTreegeForm(
    nodes,
    edges,
    initialValues,
  );

  const onChangeRef = useRef(onChange);
  const validateRef = useRef(validate);
  const FormWrapper = components.form || DefaultFormWrapper;

  // Create render context
  const renderContext: RenderContext = useMemo(
    () => ({
      errors,
      formValues,
      getFieldValue,
      language,
      setFieldValue,
    }),
    [errors, formValues, getFieldValue, setFieldValue, language],
  );

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
   * Render an input node
   */
  const renderInputNode = useCallback(
    (processedNode: ProcessedNode) => {
      if (!isInputNode(processedNode.node)) return null;

      const inputData = processedNode.node.data as InputNodeData;
      const inputType = inputData.type || "text";
      const fieldName = inputData.name;

      if (!fieldName) {
        console.warn("Input node without name:", processedNode.node);
        return null;
      }

      const CustomRenderer = components.inputs?.[inputType];
      const DefaultRenderer = defaultInputRenderers[inputType as keyof typeof defaultInputRenderers];
      const Renderer = CustomRenderer || DefaultRenderer || defaultInputRenderers.text;
      const value = getFieldValue(fieldName);
      const error = errors[fieldName];

      return (
        <Renderer
          key={processedNode.node.id}
          node={processedNode.node}
          value={value}
          onChange={(newValue) => setFieldValue(fieldName, newValue)}
          error={error}
          context={renderContext}
        />
      );
    },
    [components.inputs, getFieldValue, setFieldValue, errors, renderContext],
  );

  /**
   * Render a node based on its type (recursive)
   */
  const renderNode: (processedNode: ProcessedNode) => ReactNode = useCallback(
    (processedNode: ProcessedNode) => {
      console.log(processedNode);

      if (!processedNode.visible) return null;

      const { node } = processedNode;
      const { type } = node;

      switch (type) {
        case "input":
          return renderInputNode(processedNode);

        case "group": {
          if (!isGroupNode(processedNode.node)) return null;

          const GroupComponent = components.group || DefaultGroup;

          return (
            <GroupComponent key={processedNode.node.id} node={processedNode.node} context={renderContext}>
              {processedNode.children?.map((child) => renderNode(child))}
            </GroupComponent>
          );
        }

        case "ui": {
          if (!isUINode(processedNode.node)) return null;

          const uiData = processedNode.node.data as UINodeData;
          const uiType = uiData.type || "default";
          const CustomRenderer = components.ui?.[uiType];
          const Renderer = CustomRenderer || components.ui?.default || DefaultUI;

          return <Renderer key={processedNode.node.id} node={processedNode.node} context={renderContext} />;
        }

        case "json":
        case "flow":
          // TODO: Handle flow & json nodes
          return null;

        default:
          console.warn("Unknown node type:", type);
          return null;
      }
    },
    [renderInputNode, components.group, components.ui, renderContext],
  );

  /**
   * Handle custom validation (optimized with ref and dependency check)
   */
  useEffect(() => {
    if (validateRef.current && (validationMode === "onChange" || validationMode === "onBlur")) {
      const customErrors = validateRef.current(formValues, visibleNodes);
      setErrors((prev) => ({ ...prev, ...customErrors }));
    }
  }, [formValues, validationMode, visibleNodes, setErrors]);

  /**
   * Use ref to store the latest onChange callback to avoid unnecessary re-renders
   */
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  //

  /**
   * Use ref to store the latest validate callback to avoid unnecessary re-renders
   */
  useEffect(() => {
    validateRef.current = validate;
  }, [validate]);

  /**
   * Notify parent of form changes (optimized with ref)
   */
  useEffect(() => {
    onChangeRef.current?.(formValues);
  }, [formValues]);

  return <FormWrapper onSubmit={handleSubmit}>{processedNodes.map((processedNode) => renderNode(processedNode))}</FormWrapper>;
};

export default TreegeRenderer;
