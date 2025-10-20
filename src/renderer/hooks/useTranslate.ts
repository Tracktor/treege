import { useMemo } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { Translatable } from "@/shared/types/translate";
import { getTranslatedText } from "@/shared/utils/label";

/**
 * Hook for translating text (labels, placeholders, helper text, error messages, etc.)
 * with context-aware language preference from TreegeRendererContext.
 *
 * @returns A function that translates a Translatable object to the current language
 *
 * @example
 * // Using context language
 * const t = useTranslate();
 * const translatedLabel = t(node.data.label);
 *
 * @example
 * // Using explicit language (useful outside context or before context is available)
 * const t = useTranslate("fr");
 * const translatedLabel = t(node.data.label);
 * @param language
 */
export const useTranslate = (language?: string) => {
  const { language: contextLanguage } = useTreegeRendererContext();
  const langue = language ?? contextLanguage;

  return useMemo(() => (text?: Translatable | string) => getTranslatedText(text, langue), [langue]);
};
