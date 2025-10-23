import { Node } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { FormValues } from "@/renderer/types/renderer";
import { getFlowRenderState, mergeFlows } from "@/renderer/utils/flow";
import { isFieldEmpty } from "@/renderer/utils/form";
import { getInputNodes } from "@/renderer/utils/node";
import { Flow, TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * PURE STATE LOGIC HOOK
 *
 * This hook manages the internal form state and visibility logic.
 * It contains NO side effects (no useEffect).
 * All state is keyed by nodeId for uniqueness.
 *
 * Responsibilities:
 * - Form values state (keyed by nodeId)
 * - Errors state
 * - Node visibility calculation (progressive rendering)
 * - Form validation (built-in: required, pattern)
 * - Submit button state (combines end-of-path detection + form validity)
 *
 * NOT responsible for:
 * - Export/conversion to external format (done in component)
 * - Side effects like onChange callbacks (done in component)
 * - Custom validation (passed to component)
 */

/**
 * Custom hook for TreegeRenderer - Pure state logic only
 *
 * @param flows - Flow or array of flows (can be null/undefined)
 * @param initialValues - Initial form values (will be merged with node defaults)
 * @param language - Preferred language for translations (defaults to 'en')
 * @returns Pure state and computed values (no side effects)
 */
export const useTreegeRenderer = (flows: Flow | Flow[] | null | undefined, initialValues: FormValues = {}, language: string = "en") => {
  // Merge flows once and extract nodes/edges
  const mergedFlow = useMemo(() => mergeFlows(flows), [flows]);
  const { nodes, edges } = mergedFlow;
  const inputNodes = useMemo(() => getInputNodes(nodes), [nodes]);
  const t = useTranslate(language);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const defaultValues: FormValues = { ...initialValues };

    nodes.forEach((node) => {
      if (isInputNode(node)) {
        const fieldName = node.id;

        if (defaultValues[fieldName] !== undefined) {
          return;
        }

        const { defaultValue } = node.data;
        if (!defaultValue) {
          return;
        }

        // Handle static default value
        if (defaultValue.type === "static" && defaultValue.staticValue !== undefined) {
          defaultValues[fieldName] = defaultValue.staticValue;
        }

        // Handle reference default value
        if (defaultValue.type === "reference" && defaultValue.referenceField) {
          const { referenceField } = defaultValue;
          const refValue = defaultValues[referenceField];
          if (refValue !== undefined) {
            defaultValues[fieldName] = refValue;
          }
        }
      }
    });

    return defaultValues;
  });

  const { endOfPathReached, visibleNodes, visibleRootNodes } = useMemo(
    () => getFlowRenderState(nodes, edges, formValues),
    [nodes, edges, formValues],
  );

  /**
   * Set field value and clear error for that field
   */
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user types
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Validate form with both built-in and custom validation
   * Custom errors take precedence over built-in errors when both exist
   *
   * @param customValidate - Optional custom validation function
   * @returns Validation result with isValid flag and errors object
   */
  const validateForm = useCallback(
    (customValidate?: (values: FormValues, visibleNodesList: Node<TreegeNodeData>[]) => Record<string, string>) => {
      // Step 1: Run built-in validation (required, pattern)
      const builtInErrors: Record<string, string> = {};

      visibleNodes.forEach((node) => {
        if (isInputNode(node)) {
          const fieldName = node.id;
          const value = formValues[fieldName];

          // Required validation
          if (node.data.required && isFieldEmpty(value)) {
            builtInErrors[fieldName] = t(node.data.errorMessage) || t("validation.required");
            return;
          }

          // Pattern validation (only if value is not empty)
          if (!isFieldEmpty(value) && node.data.pattern) {
            try {
              const regex = new RegExp(node.data.pattern);
              if (!regex.test(String(value))) {
                builtInErrors[fieldName] = t(node.data.errorMessage) || t("validation.invalidFormat");
              }
            } catch (e) {
              console.error(`Invalid pattern for field ${fieldName}:`, e);
            }
          }
        }
      });

      // Step 2: Run custom validation if provided
      const customErrors = customValidate ? customValidate(formValues, visibleNodes) : {};

      // Step 3: Merge errors - custom errors take precedence
      const finalErrors = {
        ...builtInErrors,
        ...customErrors,
      };

      // Step 4: Update form errors state
      setFormErrors(finalErrors);

      // Step 5: Return validation result
      return {
        errors: finalErrors,
        hasCustomErrors: Object.keys(customErrors).length > 0,
        isValid: Object.keys(finalErrors).length === 0,
      };
    },
    [visibleNodes, formValues, t],
  );

  /**
   * Get list of missing required fields for tooltip
   * Returns array of field labels that are required but not filled
   */
  const missingRequiredFields = useMemo(() => {
    const missing: string[] = [];

    visibleNodes.forEach((node) => {
      if (!isInputNode(node)) {
        return;
      }

      const fieldName = node.id;
      const value = formValues[fieldName];

      // Check if required field is empty
      if (node.data.required && isFieldEmpty(value)) {
        const label = t(node.data.label) || fieldName;
        missing.push(label);
      }
    });

    return missing;
  }, [visibleNodes, formValues, t]);

  return {
    canSubmit: endOfPathReached && nodes.length > 0,
    formErrors,
    formValues,
    inputNodes,
    mergedFlow,
    missingRequiredFields,
    setFieldValue,
    setFormErrors,
    t,
    validateForm,
    visibleNodes,
    visibleRootNodes,
  };
};
