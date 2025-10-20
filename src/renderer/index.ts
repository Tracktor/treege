// Main component (web version by default)
export { default as TreegeRenderer } from "@/renderer/features/TreegeRenderer/web/TreegeRenderer";

// Default web components (for customization reference)
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultFormWrapper";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultGroup";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultInputs";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
export * from "@/renderer/features/TreegeRenderer/web/components/DefaultUI";

// Hooks
export { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";

// Theme
export { ThemeProvider, useTheme } from "@/shared/context/ThemeContext";

// Utils
export * from "@/renderer/utils/conditions";
export * from "@/renderer/utils/form";
export * from "@/renderer/utils/flow";
export { getTranslatedText } from "@/shared/utils/label";

// Types
export * from "@/renderer/types/renderer";
