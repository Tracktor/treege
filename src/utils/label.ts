import { TranslatableLabel } from "@/type/translate";

/**
 * Get the translated label, with fallback to English or first available language
 * @param label - The translatable label object
 * @param preferredLang - Optional preferred language (defaults to 'en')
 * @returns The translated string or empty string if none available
 */
export const getTranslatedLabel = (label?: TranslatableLabel, preferredLang: string = "en"): string => {
  if (!label) {
    return "";
  }

  return label[preferredLang] || label.en || Object.values(label).find(Boolean) || "";
};

export default {};
