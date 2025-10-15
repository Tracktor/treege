import { Node } from "@xyflow/react";
import { InputNodeData } from "@/shared/types/node";
import { TranslatableLabel } from "@/shared/types/translate";
import { getTranslatedLabel } from "@/shared/utils/label";

/**
 * Get field name for an input node (use name or fallback to node ID)
 */
export const getFieldName = (node: Node<InputNodeData>): string => node.data.name || node.id;

/**
 * Helper to safely render a label (TranslatableLabel | string) as a string
 * Default components use this to avoid TypeScript errors with TranslatableLabel
 * If language is provided, uses getTranslatedLabel, otherwise converts to string
 */
export const renderLabel = (label: TranslatableLabel | string | undefined, language?: string): string => {
  if (!label) return "";
  if (typeof label === "string") return label;

  // If no language provided, use getTranslatedLabel with default 'en'
  return getTranslatedLabel(label, language || "en");
};
