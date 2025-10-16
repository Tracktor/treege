// Main component (web version by default)
export { default as TreegeRenderer } from "@/renderer/features/TreegeRenderer/web/TreegeRenderer";

// Default web components (for customization reference)
export * from "@/renderer/components/web/DefaultInputs";
export * from "@/renderer/components/web/DefaultGroup";
export * from "@/renderer/components/web/DefaultUI";
export * from "@/renderer/components/web/DefaultFormWrapper";
export * from "@/renderer/components/web/DefaultSubmitButton";

// Hooks
export { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";

// Utils (platform-agnostic)
export * from "@/renderer/utils/conditionEvaluator";
export * from "@/renderer/utils/form";
export { getTranslatedLabel } from "@/shared/utils/label";

// Types
export * from "@/renderer/types/renderer";
