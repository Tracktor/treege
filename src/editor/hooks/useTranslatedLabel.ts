import { Translatable } from "@/shared/types/translate";
import { getTranslatedLabel } from "@/shared/utils/label";

/**
 * Hook for translating labels with context-aware language preference
 */
const useTranslatedLabel = () => {
  const preferredLanguage = "en";
  return (label?: Translatable) => getTranslatedLabel(label, preferredLanguage);
};

export default useTranslatedLabel;
