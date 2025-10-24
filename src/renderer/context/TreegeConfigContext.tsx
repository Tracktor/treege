import { createContext, ReactNode, useContext } from "react";
import { TreegeRendererComponents, TreegeRendererConfig } from "@/renderer/types/renderer";

const TreegeConfigContext = createContext<TreegeRendererConfig | undefined>(undefined);

/**
 * Hook to access the global Treege configuration
 * Returns undefined if used outside of TreegeConfigProvider
 */
export const useTreegeConfig = (): TreegeRendererConfig | undefined => {
  return useContext(TreegeConfigContext);
};

export type TreegeConfigProviderProps = {
  children: ReactNode;
  /**
   * Custom component renderers (can be overridden per TreegeRenderer instance)
   */
  components?: TreegeRendererComponents;
  /**
   * Google Maps API key for address autocomplete
   * If not provided, falls back to free Nominatim (OpenStreetMap)
   */
  googleApiKey?: string;
  /**
   * Default language for translations
   * @default "en"
   */
  language?: string;
  /**
   * Default theme for all renderers
   * @default "dark"
   */
  theme?: "dark" | "light";
  /**
   * Default validation mode
   * @default "onSubmit"
   */
  validationMode?: "onChange" | "onSubmit";
};

/**
 * Provider for global Treege configuration
 * Wrap your app with this provider to set default options for all TreegeRenderer instances
 */
export const TreegeConfigProvider = ({
  children,
  components,
  googleApiKey,
  language,
  theme,
  validationMode,
}: TreegeConfigProviderProps) => {
  const config: TreegeRendererConfig = {
    components,
    googleApiKey,
    language,
    theme,
    validationMode,
  };

  return <TreegeConfigContext.Provider value={config}>{children}</TreegeConfigContext.Provider>;
};
