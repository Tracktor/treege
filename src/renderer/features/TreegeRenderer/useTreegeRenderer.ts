import { Edge, Node } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { FormValues } from "@/renderer/types/renderer";
import { getVisibleNodesInOrder } from "@/renderer/utils/flow";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { TreegeNodeData } from "@/shared/types/node";
import { getTranslatedLabel } from "@/shared/utils/label";
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
 * - End of path detection
 *
 * NOT responsible for:
 * - Export/conversion to external format (done in component)
 * - Side effects like onChange callbacks (done in component)
 * - Custom validation (passed to component)
 */

/**
 * Custom hook for TreegeRenderer - Pure state logic only
 *
 * @param nodes - All nodes from the editor
 * @param edges - All edges from the editor
 * @param initialValues - Initial form values (will be merged with node defaults)
 * @param language - Preferred language for translations (defaults to 'en')
 * @returns Pure state and computed values (no side effects)
 */
export const useTreegeRenderer = (
  nodes: Node<TreegeNodeData>[],
  edges: Edge<ConditionalEdgeData>[],
  initialValues: FormValues = {},
  language: string = "en",
) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const defaultValues: FormValues = { ...initialValues };

    nodes.forEach((node) => {
      if (isInputNode(node)) {
        const fieldName = node.id;

        if (defaultValues[fieldName] !== undefined) return;

        const { defaultValue } = node.data;
        if (!defaultValue) return;

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

  const { canSubmit, visibleNodes, visibleRootNodes } = useMemo(
    () => getVisibleNodesInOrder(nodes, edges, formValues),
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
   * Check if form is valid based on visible input nodes
   */
  const checkValidForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    visibleNodes.forEach((node) => {
      if (isInputNode(node)) {
        const fieldName = node.id;
        const value = formValues[fieldName];

        // Required validation
        if (node.data.required) {
          if (value === undefined || value === null || value === "") {
            newErrors[fieldName] = getTranslatedLabel(node.data.errorMessage, language) || "This field is required";
            return;
          }
        }

        // Pattern validation (only if value is not empty)
        if (value && node.data.pattern) {
          try {
            const regex = new RegExp(node.data.pattern);
            if (!regex.test(String(value))) {
              newErrors[fieldName] = getTranslatedLabel(node.data.errorMessage, language) || "Invalid format";
            }
          } catch (e) {
            console.error(`Invalid pattern for field ${fieldName}:`, e);
          }
        }
      }
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [visibleNodes, formValues, language]);

  return {
    canSubmit,
    checkValidForm,
    formErrors,
    formValues,
    setFieldValue,
    setFormErrors,
    visibleNodes,
    visibleRootNodes,
  };
};
