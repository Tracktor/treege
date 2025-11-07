import { Node } from "@xyflow/react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { useTreegeConfig } from "@/renderer/context/TreegeConfigContext";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import DefaultFormWrapper from "@/renderer/features/TreegeRenderer/web/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/features/TreegeRenderer/web/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/features/TreegeRenderer/web/components/DefaultInputs";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
import DefaultSubmitButtonWrapper from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButtonWrapper";
import { defaultUI } from "@/renderer/features/TreegeRenderer/web/components/DefaultUI";
import { useSubmitHandler } from "@/renderer/hooks/useSubmitHandler";
import { InputRenderProps, InputValue, TreegeRendererProps } from "@/renderer/types/renderer";
import { calculateReferenceFieldUpdates, convertFormValuesToNamedFormat } from "@/renderer/utils/form";
import { resolveNodeKey } from "@/renderer/utils/node";
import { NODE_TYPE } from "@/shared/constants/node";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { TreegeNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";
import { getTranslatedText } from "@/shared/utils/translations";

const TreegeRenderer = ({
  components,
  flows,
  googleApiKey,
  initialValues = {},
  language,
  onChange,
  onSubmit,
  theme,
  validate,
  validationMode,
}: TreegeRendererProps) => {
  // Get global config from provider (if any)
  const globalConfig = useTreegeConfig();

  // Merge props with global config (props take precedence)
  const config = {
    components: {
      form: components?.form ?? globalConfig?.components?.form,
      group: components?.group ?? globalConfig?.components?.group,
      inputs: { ...globalConfig?.components?.inputs, ...components?.inputs },
      submitButton: components?.submitButton ?? globalConfig?.components?.submitButton,
      submitButtonWrapper: components?.submitButtonWrapper ?? globalConfig?.components?.submitButtonWrapper,
      ui: { ...globalConfig?.components?.ui, ...components?.ui },
    },
    googleApiKey: googleApiKey ?? globalConfig?.googleApiKey,
    language: language ?? globalConfig?.language ?? "en",
    theme: theme ?? globalConfig?.theme ?? "dark",
    validationMode: validationMode ?? globalConfig?.validationMode ?? "onSubmit",
  };

  const {
    canSubmit,
    mergedFlow,
    formErrors,
    formValues,
    inputNodes,
    missingRequiredFields,
    prevFormValuesRef,
    visibleNodes,
    visibleRootNodes,
    setFieldValue,
    setMultipleFieldValues,
    validateForm,
    t,
  } = useTreegeRenderer(flows, initialValues, config.language);

  // Submit handler for submit button with configuration
  const { handleSubmitWithConfig, hasSubmitConfig, isSubmitting, submitMessage, clearSubmitMessage } = useSubmitHandler(
    visibleNodes,
    formValues,
    config.language,
    inputNodes,
  );

  // Components with fallbacks
  const FormWrapper = config.components.form || DefaultFormWrapper;
  const SubmitButton = config.components.submitButton || DefaultSubmitButton;
  const SubmitButtonWrapper = config.components.submitButtonWrapper || DefaultSubmitButtonWrapper;
  // Refs to avoid re-creating effects
  const onChangeRef = useRef(onChange);
  const validateRef = useRef(validate);
  // Memoize exported values for callbacks
  const exportedValues = useMemo(() => convertFormValuesToNamedFormat(formValues, inputNodes), [formValues, inputNodes]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate the form
      const { isValid, errors } = validateForm(validateRef.current);

      if (!isValid) {
        // Focus the first input field with an error
        const firstErrorNodeId = Object.keys(errors)[0];

        if (firstErrorNodeId) {
          // Use id attribute for reliable focus (always present and unique)
          const input = document.getElementById(firstErrorNodeId);
          input?.focus();
        }
        return;
      }

      // If there's a submit button with configuration, use it
      if (hasSubmitConfig) {
        const result = await handleSubmitWithConfig((httpResponse) => {
          // Call onSubmit callback with form values and HTTP response as second parameter
          if (onSubmit) {
            onSubmit(exportedValues, { httpResponse });
          }
        });

        // If result is null, it means the submit config is incomplete (no URL)
        // Fall back to the default submit behavior
        if (result === null) {
          onSubmit?.(exportedValues);
          return;
        }

        // If submission failed, return early
        if (!result.success) {
          return;
        }
      } else if (onSubmit) {
        // Default behavior: call onSubmit directly
        onSubmit(exportedValues);
      }
    },
    [validateForm, hasSubmitConfig, handleSubmitWithConfig, onSubmit, exportedValues],
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
          if (!isInputNode(node)) {
            return null;
          }

          const inputData = node.data;
          const inputType = inputData.type || "text";
          const CustomRenderer = config.components.inputs?.[inputType];
          const DefaultRenderer = defaultInputRenderers[inputType as keyof typeof defaultInputRenderers];
          const Renderer = (CustomRenderer || DefaultRenderer) as (props: InputRenderProps) => ReactNode;
          const fieldId = node.id;
          const value = formValues[fieldId];
          const error = formErrors[fieldId];
          const setValue = (newValue: InputValue) => setFieldValue(fieldId, newValue);
          const label = getTranslatedText(inputData.label, config.language);
          const placeholder = getTranslatedText(inputData.placeholder, config.language);
          const helperText = getTranslatedText(inputData.helperText, config.language);
          const name = resolveNodeKey(node);

          return (
            <Renderer
              key={node.id}
              id={node.id}
              node={node}
              value={value}
              error={error}
              label={label}
              placeholder={placeholder}
              helperText={helperText}
              name={name}
              setValue={setValue}
              missingRequiredFields={missingRequiredFields}
            />
          );
        }

        case NODE_TYPE.group: {
          if (!isGroupNode(node)) {
            return null;
          }

          const GroupComponent = config.components.group || DefaultGroup;
          // Filter children - visibleNodes maintains flow order from getFlowRenderState
          const childNodes = visibleNodes.filter((child) => child.parentId === node.id);

          return (
            <GroupComponent key={node.id} node={node}>
              {childNodes.map((child) => renderNode(child))}
            </GroupComponent>
          );
        }

        case NODE_TYPE.ui: {
          if (!isUINode(node)) {
            return null;
          }

          const uiData = node.data as UINodeData;
          const uiType = uiData.type || "title";
          const CustomRenderer = config.components.ui?.[uiType];
          const DefaultRenderer = defaultUI[uiType as keyof typeof defaultUI];
          const Renderer = CustomRenderer || DefaultRenderer;

          return <Renderer key={node.id} node={node} />;
        }

        case NODE_TYPE.flow: {
          // FlowNodes are already merged in the pre-processing step
          // So we should never reach here, but just in case, return null
          return null;
        }

        default:
          console.warn("Unknown node type:", type);
          return null;
      }
    },
    [config.components, config.language, visibleNodes, formValues, formErrors, setFieldValue, missingRequiredFields],
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
   * Run validation on form values change if validationMode is "onChange" or "onBlur"
   */
  useEffect(() => {
    if (config.validationMode === "onChange") {
      validateForm(validateRef.current);
    }
  }, [config.validationMode, validateForm]);

  /**
   * Sync reference fields when their source changes (one-way binding)
   * Note: prevFormValuesRef is intentionally not in deps (refs don't trigger re-renders)
   */
  useEffect(() => {
    const updatedValues = calculateReferenceFieldUpdates(inputNodes, formValues, prevFormValuesRef.current);

    // Only update if there are changes to avoid unnecessary function calls
    if (Object.keys(updatedValues).length > 0) {
      setMultipleFieldValues(updatedValues);
    }

    // Update previous values ref
    prevFormValuesRef.current = formValues;
  }, [formValues, inputNodes, setMultipleFieldValues, prevFormValuesRef]);

  return (
    <ThemeProvider theme={config.theme} storageKey="treege-renderer-theme">
      <TreegeRendererProvider
        value={{
          flows: mergedFlow,
          formErrors,
          formValues,
          googleApiKey: config.googleApiKey,
          inputNodes,
          language: config.language,
          setFieldValue,
        }}
      >
        <FormWrapper onSubmit={handleSubmit}>
          {/* Node */}
          {visibleRootNodes.map((node) => renderNode(node))}

          {/* Submit */}
          {canSubmit && (
            <SubmitButtonWrapper missingFields={missingRequiredFields}>
              <SubmitButton label={t("renderer.defaultSubmitButton.submit")} disabled={isSubmitting} />
            </SubmitButtonWrapper>
          )}
        </FormWrapper>

        {/* Powered by Treege */}
        <p className="py-2 text-muted-foreground text-xs">Powered by Treege</p>

        {/* Submit message (success/error) */}
        {submitMessage && (
          <div
            className={`my-4 rounded-md p-4 ${
              submitMessage.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
            role="alert"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{submitMessage.message}</p>
              <button
                type="button"
                onClick={clearSubmitMessage}
                className="ml-4 font-medium text-sm underline hover:no-underline focus:outline-none"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        )}
      </TreegeRendererProvider>
    </ThemeProvider>
  );
};

export default TreegeRenderer;
