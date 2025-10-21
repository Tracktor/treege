import { useMemo } from "react";
import { useTreegeEditorContext } from "@/editor/context/TreegeEditorContext";
import { useStaticTranslations } from "@/shared/hooks/useStaticTranslations";
import { Translatable } from "@/shared/types/translate";
import { getTranslatedText, TranslationKey } from "@/shared/utils/translations";

/**
 * Unified hook for translating text (both static and dynamic translations)
 * with context-aware language preference from TreegeEditorContext.
 *
 * This hook handles two types of translations:
 * 1. Static translations: Internal UI strings from translation files (passed as string keys)
 * 2. Dynamic translations: User-defined translatable content from nodes (passed as Translatable objects)
 *
 * @returns A function that translates either a translation key or a Translatable object
 *
 * @example
 * // Static translation (from translation files)
 * const t = useTranslate();
 * const saveButton = t("common.save"); // "Save"
 *
 * @example
 * // Dynamic translation (from node data)
 * const t = useTranslate();
 * const label = t(node.data.label); // Translates user-defined content
 */
const useTranslate = () => {
  const { language } = useTreegeEditorContext();

  // Get static translations for internal UI strings
  const staticTranslations = useStaticTranslations(language);

  return useMemo(
    () => (key?: Translatable | TranslationKey | string) => {
      if (!key) return "";

      // If it's a Translatable object (dynamic translation from nodes)
      if (typeof key === "object") {
        return getTranslatedText(key, language);
      }

      // If it's a string, check if it's a translation key first
      if (key in staticTranslations) {
        return staticTranslations[key as TranslationKey];
      }

      // If not a known translation key, treat it as a plain string (for backward compatibility)
      return key;
    },
    [language, staticTranslations],
  );
};

export default useTranslate;
