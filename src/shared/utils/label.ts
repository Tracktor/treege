import { Translatable } from "@/shared/types/translate";

/**
 * Get the translated text (label, placeholder, helper text, error message, etc.)
 * with fallback to English or first available language
 * @param text - The translatable text object or plain string
 * @param language - Optional preferred language (defaults to 'en')
 * @returns The translated string or empty string if none available
 */
export const getTranslatedText = (text?: Translatable | string, language: string = "en"): string => {
  if (!text) {
    return "";
  }

  if (typeof text === "string") {
    return text;
  }

  return text[language] || text.en || Object.values(text).find(Boolean) || "";
};
