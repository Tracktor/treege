import { Edge, Node } from "@xyflow/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { FormValues } from "@/renderer/types/renderer";
import { TreegeNodeData } from "@/shared/types/node";

export type TreegeRendererContextValue = {
  edges: Edge[];
  formErrors: Record<string, string>;
  formValues: FormValues;
  googleApiKey?: string;
  language: string;
  nodes: Node<TreegeNodeData>[];
  setFieldValue: (fieldName: string, value: any) => void;
};

export interface TreegeRendererProviderProps extends PropsWithChildren {
  value: TreegeRendererContextValue;
}

export const TreegeRendererContext = createContext<TreegeRendererContextValue | null>(null);

export const TreegeRendererProvider = ({ children, value }: TreegeRendererProviderProps) => (
  <TreegeRendererContext.Provider value={value}>{children}</TreegeRendererContext.Provider>
);

export const useTreegeRendererContext = () => {
  const context = useContext(TreegeRendererContext);

  return (
    context ?? {
      edges: [],
      formErrors: {},
      formValues: {},
      googleApiKey: undefined,
      language: "",
      nodes: [],
      setFieldValue: () => {},
    }
  );
};
