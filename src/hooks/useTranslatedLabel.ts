import { TranslatableLabel } from "@/type/translate";
import { getTranslatedLabel } from "@/utils/label";

/**
 * Hook for translating labels with context-aware language preference
 */
const useTranslatedLabel = () => {
  const preferredLanguage = "en";
  return (label?: TranslatableLabel) => getTranslatedLabel(label, preferredLanguage);
};

export default useTranslatedLabel;
