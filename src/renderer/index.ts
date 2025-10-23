// Main component (web version by default)

// Hooks
export { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";

// Default web components (for customization reference)
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultFormWrapper";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultGroup";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultInputs";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultUI";
export { default as TreegeRenderer } from "@/renderer/features/TreegeRenderer/web/TreegeRenderer";
// Types
export * from "@/renderer/types/renderer";

// Utils
export * from "@/renderer/utils/conditions";
export * from "@/renderer/utils/flow";
export * from "@/renderer/utils/form";
// Theme
export { ThemeProvider, useTheme } from "@/shared/context/ThemeContext";
export { getTranslatedText } from "@/shared/utils/translations";
