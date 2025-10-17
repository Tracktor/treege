import { Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { InputNodeData } from "@/shared/types/node";

/**
 * Check if a form field has a value (not empty)
 * @param fieldName - The name of the form field
 * @param formValues - The current form values
 * @returns True if the field has a non-empty value, false otherwise
 */
export const checkHasFormFieldValue = (fieldName: string | undefined, formValues: FormValues): boolean => {
  if (!fieldName) return false;
  const value = formValues[fieldName];
  return value !== undefined && value !== null && value !== "";
};

/**
 * Convert internal form values (keyed by nodeId) to external format (keyed by name)
 * When multiple nodes share the same name, later values overwrite earlier ones
 * example: convertFormValuesToNamedFormat({ id1: 'Alice', id2: 'Bob' }, [ { id: 'id1', data: { name: 'firstName' } }, { id: 'id2', data: { name: 'lastName' } } ])
 * returns { firstName: 'Alice', lastName: 'Bob' }
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
