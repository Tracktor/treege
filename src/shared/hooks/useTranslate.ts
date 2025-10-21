import { useMemo } from "react";
import { Translatable } from "@/shared/types/translate";
import { getStaticTranslations, getTranslatedText, TranslationKey } from "@/shared/utils/translations";

/**
 * Unified hook for translating text (both static and dynamic translations)
 *
 * This hook handles two types of translations:
 * 1. Static translations: Internal UI strings from translation files (passed as string keys)
 * 2. Dynamic translations: User-defined translatable content from nodes (passed as Translatable objects)
 *
 * @param language - The language code to use for translations
 * @returns A function that translates either a translation key or a Translatable object
 *
 * @example
 * // Static translation (from translation files)
 * const t = useTranslate("fr");
 * const saveButton = t("common.save"); // "Enregistrer"
 *
 * @example
 * // Dynamic translation (from node data)
 * const t = useTranslate("en");
 * const label = t(node.data.label); // Translates user-defined content
 */
export const useTranslate = (language: string) => {
  // Get static translations for internal UI strings (memoized)
  const staticTranslations = useMemo(() => getStaticTranslations(language), [language]);

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
