import { TranslatableLabel } from "@/shared/types/translate";

/**
 * Get the translated label, with fallback to English or first available language
 * @param label - The translatable label object
 * @param language - Optional preferred language (defaults to 'en')
 * @returns The translated string or empty string if none available
 */
export const getTranslatedLabel = (label?: TranslatableLabel | string, language: string = "en"): string => {
  if (!label) {
    return "";
  }

  if (typeof label === "string") {
    return label;
  }

  return label[language] || label.en || Object.values(label).find(Boolean) || "";
};
