import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

export interface TreegeEditorContextValue {
  language: string;
  flowId?: string;
  setFlowId?: (flow?: string) => void;
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
