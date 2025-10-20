import { Translatable } from "@/shared/types/translate";
import { getTranslatedText } from "@/shared/utils/translations";

/**
 * Hook for translating text (labels, placeholders, helper text, error messages, etc.)
 * with context-aware language preference
 */
const useTranslate = () => {
  const preferredLanguage = "en";
  return (text?: Translatable | string) => getTranslatedText(text, preferredLanguage);
};

export default useTranslate;
