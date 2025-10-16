import { createContext, PropsWithChildren, useContext } from "react";
import { FormValues } from "@/renderer/types/renderer";

export type TreegeContextValue = {
  formValues: FormValues;
  setFieldValue: (fieldName: string, value: any) => void;
  errors: Record<string, string>;
  language: string;
};

export interface TreegeRendererProviderProps extends PropsWithChildren {
  value: TreegeContextValue;
}

export const TreegeRendererContext = createContext<TreegeContextValue | null>(null);

export const TreegeRendererProvider = ({ children, value }: TreegeRendererProviderProps) => (
  <TreegeRendererContext.Provider value={value}>{children}</TreegeRendererContext.Provider>
);

export const useTreegeRendererContext = () => {
  const context = useContext(TreegeRendererContext);

  if (!context) {
    throw new Error("useTreegeContext must be used within TreegeRenderer");
  }
  return context;
};
