import { createContext, ReactNode, useContext } from "react";
import { FormValues } from "@/renderer/types/renderer";

export type TreegeContextValue = {
  formValues: FormValues;
  setFieldValue: (fieldName: string, value: any) => void;
  getFieldValue: (fieldName: string) => any;
  errors: Record<string, string>;
  language: string;
};

export const TreegeRendererContext = createContext<TreegeContextValue | null>(null);

export const TreegeRendererProvider = ({ children, value }: { children: ReactNode; value: TreegeContextValue }) => (
  <TreegeRendererContext.Provider value={value}>{children}</TreegeRendererContext.Provider>
);

export const useTreegeRendererContext = () => {
  const context = useContext(TreegeRendererContext);

  if (!context) {
    throw new Error("useTreegeContext must be used within TreegeRenderer");
  }
  return context;
};
