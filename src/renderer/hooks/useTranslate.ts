import { useMemo } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useStaticTranslations } from "@/shared/hooks/useStaticTranslations";
import { Translatable } from "@/shared/types/translate";
import { getTranslatedText, TranslationKey } from "@/shared/utils/translations";

/**
 * Unified hook for translating text (both static and dynamic translations)
 * with context-aware language preference from TreegeRendererContext.
 *
 * This hook handles two types of translations:
 * 1. Static translations: Internal UI strings from translation files (passed as string keys)
 * 2. Dynamic translations: User-defined translatable content from nodes (passed as Translatable objects)
 *
 * @param language - Optional language override. If not provided, uses language from context.
 * @returns A function that translates either a translation key or a Translatable object
 *
 * @example
 * // Static translation (from translation files)
 * const t = useTranslate();
 * const errorMsg = t("validation.required"); // "This field is required"
 *
 * @example
 * // Dynamic translation (from node data)
 * const t = useTranslate();
 * const label = t(node.data.label); // Translates user-defined content
 *
 * @example
 * // With explicit language
 * const t = useTranslate("fr");
 * const errorMsg = t("validation.required"); // "Ce champ est requis"
 */
export const useTranslate = (language?: string) => {
  const { language: contextLanguage } = useTreegeRendererContext();
  const lang = language ?? contextLanguage;

  // Get static translations for internal UI strings
  const staticTranslations = useStaticTranslations(lang);

  return useMemo(
    () => (key?: Translatable | TranslationKey | string) => {
      if (!key) return "";

      // If it's a Translatable object (dynamic translation from nodes)
      if (typeof key === "object") {
        return getTranslatedText(key, lang);
      }

      // If it's a string, check if it's a translation key first
      if (key in staticTranslations) {
        return staticTranslations[key as TranslationKey];
      }

      // If not a known translation key, treat it as a plain string (for backward compatibility)
      return key;
    },
    [lang, staticTranslations],
  );
};
