import { Edge, Node } from "@xyflow/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { FormValues } from "@/renderer/types/renderer";
import { Flow, TreegeNodeData } from "@/shared/types/node";

export interface TreegeRendererContextValue {
  flows?: Flow | Flow[] | null;
  edges: Edge[];
  nodes: Node<TreegeNodeData>[];
  formErrors: Record<string, string>;
  formValues: FormValues;
  googleApiKey?: string;
  language: string;
  setFieldValue: (fieldName: string, value: any) => void;
}

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
      flows: [],
      formErrors: {},
      formValues: {},
      googleApiKey: undefined,
      language: "",
      nodes: [],
      setFieldValue: () => {},
    }
  );
};
