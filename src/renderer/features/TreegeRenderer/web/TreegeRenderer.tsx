import { Node } from "@xyflow/react";
import { FormEvent, ReactNode, useCallback } from "react";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import DefaultFormWrapper from "@/renderer/features/TreegeRenderer/web/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/features/TreegeRenderer/web/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/features/TreegeRenderer/web/components/DefaultInputs";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
import DefaultSubmitButtonWrapper from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButtonWrapper";
import { defaultUI } from "@/renderer/features/TreegeRenderer/web/components/DefaultUI";
import { InputRenderProps, InputValue, TreegeRendererProps } from "@/renderer/types/renderer";
import { resolveNodeKey } from "@/renderer/utils/node";
import { sanitize } from "@/renderer/utils/sanitize";
import { NODE_TYPE } from "@/shared/constants/node";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { TreegeNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";
import { getTranslatedText } from "@/shared/utils/translations";

const TreegeRenderer = ({
  components,
  className,
  flows,
  googleApiKey,
  language,
  onChange,
  onSubmit,
  theme,
  validate,
  validationMode,
  initialValues = {},
}: TreegeRendererProps) => {
  // Use shared logic hook
  const {
    canSubmit,
    clearSubmitMessage,
    config,
    firstErrorFieldId,
    formErrors,
    formValues,
    handleSubmit,
    inputNodes,
    isSubmitting,
    mergedFlow,
    missingRequiredFields,
    setFieldValue,
    submitMessage,
    t,
    visibleNodes,
    visibleRootNodes,
  } = useTreegeRenderer({
    components,
    flows,
    googleApiKey,
    initialValues,
    language,
    onChange,
    onSubmit,
    theme,
    validate,
    validationMode,
  });

  // Components with fallbacks
  const FormWrapper = config.components.form || DefaultFormWrapper;
  const SubmitButton = config.components.submitButton || DefaultSubmitButton;
  const SubmitButtonWrapper = config.components.submitButtonWrapper || DefaultSubmitButtonWrapper;

  /**
   * Web-specific form submission handler with FormEvent and focus logic
   */
  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Call the shared submit logic
      const isValid = await handleSubmit();

      // If validation failed, focus the first input field with an error
      if (!isValid && firstErrorFieldId) {
        // Use id attribute for reliable focus (always present and unique)
        const input = document.getElementById(firstErrorFieldId);
        input?.focus();
      }
    },
    [handleSubmit, firstErrorFieldId],
  );

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
          const setValue = (newValue: InputValue) => setFieldValue(fieldId, newValue);
          const fieldId = node.id;
          const value = formValues[fieldId];
          const error = formErrors[fieldId];
          const label = getTranslatedText(inputData.label, config.language);
          const placeholder = getTranslatedText(inputData.placeholder, config.language);
          const helperText = getTranslatedText(inputData.helperText, config.language);
          const name = resolveNodeKey(node);
          // Sanitize all user-controlled text to prevent XSS attacks (plainTextOnly: true by default)
          const safeLabel = sanitize(label);
          const safePlaceholder = sanitize(placeholder);
          const safeHelperText = sanitize(helperText);

          return (
            <Renderer
              key={node.id}
              id={node.id}
              node={node}
              value={value}
              error={error}
              label={safeLabel}
              placeholder={safePlaceholder}
              helperText={safeHelperText}
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

  return (
    <div className={cn("treege", className)}>
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
          <FormWrapper onSubmit={handleFormSubmit}>
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
    </div>
  );
};

export default TreegeRenderer;
