import { useMemo } from "react";
import { getStaticTranslations } from "@/shared/utils/translations";

/**
 * Hook to get static translations for a specific language
 * These translations are for internal UI elements, validation messages, etc.
 *
 * @param language - The language code (e.g., 'en', 'fr', 'es')
 * @returns An object containing all static translations for the specified language (flattened with dot notation)
 */
export const useStaticTranslations = (language: string): Record<string, string> =>
  useMemo(() => getStaticTranslations(language), [language]);
