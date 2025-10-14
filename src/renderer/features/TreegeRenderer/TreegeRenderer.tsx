import { FormEvent, useCallback, useEffect, useMemo } from "react";
import { DefaultFormWrapper, DefaultGroup, DefaultJson, DefaultUI } from "@/renderer/components/DefaultComponents";
import { defaultInputRenderers } from "@/renderer/components/DefaultInputs";
import { useTreegeForm } from "@/renderer/hooks/useTreegeForm";
import { ProcessedNode, RenderContext, TreegeRendererProps } from "@/renderer/types/renderer";
import { InputNodeData, JsonNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isJsonNode, isUINode } from "@/shared/utils/nodeTypeGuards";

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

  // Notify parent of form changes
  useEffect(() => {
    if (onChange) {
      onChange(formValues);
    }
  }, [formValues, onChange]);

  // Handle custom validation
  useEffect(() => {
    if (validate && (validationMode === "onChange" || validationMode === "onBlur")) {
      const customErrors = validate(formValues, visibleNodes);
      setErrors((prev) => ({ ...prev, ...customErrors }));
    }
  }, [formValues, validate, validationMode, visibleNodes, setErrors]);

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

      // Validate
      let isValid = validateForm();

      // Custom validation
      if (validate) {
        const customErrors = validate(formValues, visibleNodes);
        setErrors((prev) => ({ ...prev, ...customErrors }));
        isValid = isValid && Object.keys(customErrors).length === 0;
      }

      if (isValid && onSubmit) {
        onSubmit(formValues);
      }
    },
    [validateForm, validate, formValues, visibleNodes, onSubmit, setErrors],
  );

  /**
   * Render an input node
   */
  const renderInputNode = useCallback(
    (pNode: ProcessedNode) => {
      if (!isInputNode(pNode.node)) return null;

      const inputData = pNode.node.data as InputNodeData;
      const inputType = inputData.type || "text";
      const fieldName = inputData.name;

      if (!fieldName) {
        console.warn("Input node without name:", pNode.node);
        return null;
      }

      // Get custom renderer or default
      const CustomRenderer = components.inputs?.[inputType];
      const DefaultRenderer = defaultInputRenderers[inputType as keyof typeof defaultInputRenderers];
      const Renderer = CustomRenderer || DefaultRenderer || defaultInputRenderers.text;

      const value = getFieldValue(fieldName);
      const error = errors[fieldName];

      return (
        <Renderer
          key={pNode.node.id}
          node={pNode.node}
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
  const renderNode: (pNode: ProcessedNode) => React.ReactNode = useCallback(
    (pNode: ProcessedNode) => {
      if (!pNode.visible) return null;

      const { node } = pNode;

      switch (node.type) {
        case "input":
          return renderInputNode(pNode);

        case "group": {
          if (!isGroupNode(pNode.node)) return null;

          const GroupComponent = components.group || DefaultGroup;
          const children = pNode.children?.map((child) => renderNode(child));

          return (
            <GroupComponent key={pNode.node.id} node={pNode.node} context={renderContext}>
              {children}
            </GroupComponent>
          );
        }

        case "ui": {
          if (!isUINode(pNode.node)) return null;

          const uiData = pNode.node.data as UINodeData;
          const uiType = uiData.type || "default";

          const CustomRenderer = components.ui?.[uiType];
          const Renderer = CustomRenderer || components.ui?.default || DefaultUI;

          return <Renderer key={pNode.node.id} node={pNode.node} context={renderContext} />;
        }

        case "json": {
          if (!isJsonNode(pNode.node)) return null;

          const jsonData = pNode.node.data as JsonNodeData;
          let parsedData = {};

          try {
            parsedData = jsonData.json ? JSON.parse(jsonData.json) : {};
          } catch (e) {
            console.error("Failed to parse JSON node data:", e);
          }

          const JsonComponent = components.json || DefaultJson;

          return <JsonComponent key={pNode.node.id} node={pNode.node} data={parsedData} context={renderContext} />;
        }

        case "flow":
          // Flow nodes are navigation, they don't render anything
          return null;

        default:
          console.warn("Unknown node type:", node.type);
          return null;
      }
    },
    [renderInputNode, components.group, components.ui, components.json, renderContext],
  );

  // Render all processed nodes
  const renderedNodes = processedNodes.map((pNode) => renderNode(pNode));

  // Use custom form wrapper or default
  const FormWrapper = components.form || DefaultFormWrapper;

  return <FormWrapper onSubmit={handleSubmit}>{renderedNodes}</FormWrapper>;
};

export default TreegeRenderer;
export type { TreegeRendererProps };
