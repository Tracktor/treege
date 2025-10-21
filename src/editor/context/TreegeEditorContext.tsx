import { createContext, PropsWithChildren, useContext } from "react";

export type TreegeEditorContextValue = {
  language: string;
};

export interface TreegeEditorProviderProps extends PropsWithChildren {
  value: TreegeEditorContextValue;
}

export const TreegeEditorContext = createContext<TreegeEditorContextValue | null>(null);

export const TreegeEditorProvider = ({ children, value }: TreegeEditorProviderProps) => (
  <TreegeEditorContext.Provider value={value}>{children}</TreegeEditorContext.Provider>
);

export const useTreegeEditorContext = () => {
  const context = useContext(TreegeEditorContext);

  return (
    context ?? {
      language: "en",
    }
  );
};
