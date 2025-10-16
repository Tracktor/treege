import { Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { InputNodeData } from "@/shared/types/node";

/**
 * Convert internal form values (keyed by nodeId) to external format (keyed by name)
 * When multiple nodes share the same name, later values overwrite earlier ones
 */
export const exportFormValues = (formValues: FormValues, nodes: Node<InputNodeData>[]): Record<string, any> => {
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
