import { Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { InputNodeData, TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Initialize form values with defaults from input nodes
 */
export const initializeFormValues = (nodes: Node<TreegeNodeData>[], initialValues: FormValues): FormValues => {
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
};

/**
 * Check if a form field has a value (not empty)
 */
export const checkHasFormFieldValue = (fieldName: string | undefined, formValues: FormValues): boolean => {
  if (!fieldName) return false;
  const value = formValues[fieldName];
  return value !== undefined && value !== null && value !== "";
};

/**
 * Convert internal form values (keyed by nodeId) to external format (keyed by name)
 * When multiple nodes share the same name, later values overwrite earlier ones
 */
export const convertFormValuesToNamedFormat = (formValues: FormValues, nodes: Node<InputNodeData>[]): Record<string, any> => {
  const exported: Record<string, any> = {};

  nodes.forEach((node) => {
    const nodeId = node.id;
    const name = node.data.name || nodeId;

    if (formValues[nodeId] !== undefined) {
      exported[name] = formValues[nodeId];
    }
  });

  return exported;
};
