import { Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { InputNodeData } from "@/shared/types/node";

/**
 * Check if a form field value is considered empty for validation purposes
 * Used for required field validation
 * @param value - The field value to check
 * @returns True if the value is empty (undefined, null, empty string, or empty array)
 */
export const isFieldEmpty = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  return Array.isArray(value) && value.length === 0;
};

/**
 * Check if a form field has been filled by the user (presence check)
 * Considers false, 0, and "" as valid filled values
 * Used for conditional edge evaluation in progressive rendering
 * @param fieldName - The name of the form field
 * @param formValues - The current form values
 * @returns True if the field has been filled (any value except undefined/null), false otherwise
 */
export const checkFormFieldHasValue = (fieldName: string | undefined, formValues: FormValues): boolean => {
  if (!fieldName) {
    return false;
  }
  const value = formValues[fieldName];
  return value !== undefined && value !== null;
};

/**
 * Convert internal form values (keyed by nodeId) to external format (keyed by name)
 * When multiple nodes share the same name, later values overwrite earlier ones
 * example: convertFormValuesToNamedFormat({ id1: 'Alice', id2: 'Bob' }, [ { id: 'id1', data: { name: 'firstName' } }, { id: 'id2', data: { name: 'lastName' } } ])
 * returns { firstName: 'Alice', lastName: 'Bob' }
 */
export const convertFormValuesToNamedFormat = (formValues: FormValues, nodes: Node<InputNodeData>[]): Record<string, unknown> => {
  const exported: Record<string, unknown> = {};

  nodes.forEach((node) => {
    const nodeId = node.id;
    const name = node.data.name || nodeId;

    if (formValues[nodeId] !== undefined) {
      exported[name] = formValues[nodeId];
    }
  });

  return exported;
};
