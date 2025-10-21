import { useTreegeEditorContext } from "@/editor/context/TreegeEditorContext";
import { useTranslate as useTranslateShared } from "@/shared/hooks/useTranslate";

/**
 * Hook for translating text in the editor with context-aware language preference.
 *
 * This hook uses the language from TreegeEditorContext and delegates to the shared useTranslate hook.
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
export const useTranslate = (language?: string) => {
  const context = useTreegeEditorContext();
  const lang = language ?? context.language;

  console.log(lang);

  return useTranslateShared(lang);
};

export default useTranslate;
