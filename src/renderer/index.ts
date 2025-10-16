// Main component (web version by default)
export { TreegeRenderer, useTreegeRenderer } from "@/renderer/features/TreegeRenderer";

// Types
export * from "@/renderer/types/renderer";

// Default web components (for customization reference)
export * from "@/renderer/components/web/DefaultInputs";
export * from "@/renderer/components/web/DefaultGroup";
export * from "@/renderer/components/web/DefaultUI";
export * from "@/renderer/components/web/DefaultFormWrapper";

// Utils (platform-agnostic)
export * from "@/renderer/utils/conditionEvaluator";
export * from "@/renderer/utils/form";
export { getTranslatedLabel } from "@/shared/utils/label";
