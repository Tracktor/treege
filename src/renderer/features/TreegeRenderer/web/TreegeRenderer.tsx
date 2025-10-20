import { Node } from "@xyflow/react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import DefaultFormWrapper from "@/renderer/features/TreegeRenderer/web/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/features/TreegeRenderer/web/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/features/TreegeRenderer/web/components/DefaultInputs";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
import { defaultUI } from "@/renderer/features/TreegeRenderer/web/components/DefaultUI";
import { TreegeRendererProps } from "@/renderer/types/renderer";
import { convertFormValuesToNamedFormat } from "@/renderer/utils/form";
import { NODE_TYPE } from "@/shared/constants/node";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { InputNodeData, TreegeNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";

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
  theme = "dark",
}: TreegeRendererProps) => {
  const { canSubmit, checkValidForm, formErrors, formValues, setFieldValue, setFormErrors, visibleNodes, visibleRootNodes } =
    useTreegeRenderer(nodes, edges, initialValues);

  // Components with fallbacks
  const FormWrapper = components.form || DefaultFormWrapper;
  const SubmitButton = components.submitButton || DefaultSubmitButton;
  // Refs to avoid re-creating effects
  const onChangeRef = useRef(onChange);
  const validateRef = useRef(validate);
  // Memoize input nodes and exported values for callbacks
  const inputNodes = useMemo(() => nodes.filter(isInputNode) as Node<InputNodeData>[], [nodes]);
  const exportedValues = useMemo(() => convertFormValuesToNamedFormat(formValues, inputNodes), [formValues, inputNodes]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const formIsValid = checkValidForm();
      const customErrors = validateRef.current ? validateRef.current(formValues, visibleNodes) : {};
      const isValid = formIsValid && Object.keys(customErrors).length === 0;

      // Replace errors completely with custom errors (no merge to avoid stale errors)
      if (Object.keys(customErrors).length > 0) {
        setFormErrors(customErrors);
      }

      if (isValid && onSubmit) {
        onSubmit(exportedValues);
      }
    },
    [checkValidForm, formValues, visibleNodes, setFormErrors, onSubmit, exportedValues],
  );

  // ============================================
  // RENDERING LOGIC
  // ============================================

  /**
   * Render a single node based on its type
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
          const childNodes = visibleNodes.filter(({ parentId, id }) => parentId === id);

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

  // ============================================
  // SIDE EFFECTS
  // ============================================

  /**
   * Keep onChange ref updated
   */
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /**
   *  Keep validate ref updated
   */
  useEffect(() => {
    validateRef.current = validate;
  }, [validate]);

  /**
   * Trigger onChange callback when form values change
   */
  useEffect(() => {
    onChangeRef.current?.(exportedValues);
  }, [exportedValues]);

  /**
   * Trigger validation on change based on validation mode
   */
  useEffect(() => {
    if (validateRef.current && (validationMode === "onChange" || validationMode === "onBlur")) {
      const customErrors = validateRef.current(formValues, visibleNodes);
      // Replace errors completely (no merge to avoid stale errors)
      setFormErrors(customErrors);
    }
  }, [formValues, validationMode, visibleNodes, setFormErrors]);

  return (
    <ThemeProvider theme={theme}>
      <TreegeRendererProvider
        value={{
          edges,
          formErrors,
          formValues,
          language,
          nodes,
          setFieldValue,
        }}
      >
        <FormWrapper onSubmit={handleSubmit}>
          {visibleRootNodes.map((node) => renderNode(node))}
          {canSubmit && <SubmitButton label="Submit" />}
        </FormWrapper>
      </TreegeRendererProvider>
    </ThemeProvider>
  );
};

export default TreegeRenderer;
