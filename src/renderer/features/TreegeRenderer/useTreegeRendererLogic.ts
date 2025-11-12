import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTreegeConfig } from "@/renderer/context/TreegeConfigContext";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import { useSubmitHandler } from "@/renderer/hooks/useSubmitHandler";
import { TreegeRendererProps } from "@/renderer/types/renderer";
import { calculateReferenceFieldUpdates, convertFormValuesToNamedFormat } from "@/renderer/utils/form";

/**
 * Shared logic between web and native TreegeRenderer components
 * Handles configuration merging, form state, validation, and submission
 */
export const useTreegeRendererLogic = ({
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
}: Pick<
  TreegeRendererProps,
  "components" | "flows" | "googleApiKey" | "initialValues" | "language" | "onChange" | "onSubmit" | "theme" | "validate" | "validationMode"
>) => {
  // Get global config from provider (if any)
  const globalConfig = useTreegeConfig();

  // Merge props with global config (props take precedence)
  const config = useMemo(
    () => ({
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
    }),
    [components, globalConfig, googleApiKey, language, theme, validationMode],
  );

  const {
    canSubmit,
    formErrors,
    formValues,
    inputNodes,
    mergedFlow,
    missingRequiredFields,
    prevFormValuesRef,
    setFieldValue,
    setMultipleFieldValues,
    t,
    validateForm,
    visibleNodes,
    visibleRootNodes,
  } = useTreegeRenderer(flows, initialValues, config.language);

  // Submit handler for submit button with configuration
  const { clearSubmitMessage, handleSubmitWithConfig, hasSubmitConfig, isSubmitting, submitMessage } = useSubmitHandler(
    visibleNodes,
    formValues,
    config.language,
    inputNodes,
  );

  // Refs to avoid re-creating effects
  const onChangeRef = useRef(onChange);
  const validateRef = useRef(validate);

  // Memoize exported values for callbacks
  const exportedValues = useMemo(() => convertFormValuesToNamedFormat(formValues, inputNodes), [formValues, inputNodes]);

  /**
   * Handle form submission
   * @returns {Promise<boolean>} Returns true if validation passed, false otherwise
   */
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    // Validate the form
    const { isValid } = validateForm(validateRef.current);

    if (!isValid) {
      return false;
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
        return true;
      }

      // If submission failed, return early
      if (!result.success) {
        return true; // Validation passed but submission failed
      }
    } else if (onSubmit) {
      // Default behavior: call onSubmit directly
      onSubmit(exportedValues);
    }

    return true;
  }, [validateForm, hasSubmitConfig, handleSubmitWithConfig, onSubmit, exportedValues]);

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

  return {
    canSubmit,
    clearSubmitMessage,
    config,
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
  };
};

export type TreegeRendererLogic = ReturnType<typeof useTreegeRendererLogic>;
