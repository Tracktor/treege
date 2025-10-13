import { TranslatableLabel } from "@/shared/types/translate";
import { getTranslatedLabel } from "@/shared/utils/label";

/**
 * Hook for translating labels with context-aware language preference
 */
const useTranslatedLabel = () => {
  const preferredLanguage = "en";
  return (label?: TranslatableLabel) => getTranslatedLabel(label, preferredLanguage);
};

export default useTranslatedLabel;
