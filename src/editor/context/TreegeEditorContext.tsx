import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { AIConfig } from "@/editor/types/ai";

export interface TreegeEditorContextValue {
  /**
   * Current language
   */
  language: string;
  /**
   * Current flow ID
   */
  flowId?: string;
  /**
   * Function to set the current flow ID
   * @param flow
   */
  setFlowId?: (flow?: string) => void;
  /**
   * AI configuration for tree generation
   */
  aiConfig?: AIConfig;
}

export interface TreegeEditorProviderProps extends PropsWithChildren {
  value: TreegeEditorContextValue;
}

export const TreegeEditorContext = createContext<TreegeEditorContextValue | null>(null);

export const TreegeEditorProvider = ({ children, value }: TreegeEditorProviderProps) => {
  const [flowId, setFlowId] = useState(value?.flowId);

  const valueMemo = useMemo(
    () => ({
      ...value,
      ...(value?.aiConfig && {
        aiConfig: {
          ...value.aiConfig,
          provider: value?.aiConfig.provider ?? "gemini",
        },
      }),
      flowId,
      setFlowId,
    }),
    [flowId, value],
  );

  return <TreegeEditorContext.Provider value={valueMemo}>{children}</TreegeEditorContext.Provider>;
};

export const useTreegeEditorContext = () => {
  const context = useContext(TreegeEditorContext);

  return (
    context ?? {
      flowId: undefined,
      language: "en",
      setFlowId: () => {},
    }
  );
};
