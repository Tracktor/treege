import { Edge, Node } from "@xyflow/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { FormValues } from "@/renderer/types/renderer";
import { TreegeNodeData } from "@/shared/types/node";

export type TreegeContextValue = {
  formValues: FormValues;
  formErrors: Record<string, string>;
  setFieldValue: (fieldName: string, value: any) => void;
  language: string;
  nodes: Node<TreegeNodeData>[];
  edges: Edge[];
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
  return context ?? {};
};
