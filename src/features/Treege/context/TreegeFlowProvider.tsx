import { Node, Edge } from "@xyflow/react";
import { createContext, ReactNode, useMemo } from "react";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";
import useTreegeFlow from "@/features/Treege/TreegeFlow/useTreegeFlow";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  onNodesChange: ReturnType<typeof useTreegeFlow>["onNodesChange"];
  onEdgesChange: ReturnType<typeof useTreegeFlow>["onEdgesChange"];
  updateAttributes: ReturnType<typeof useTreegeFlow>["updateNodeAttributes"];
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  edges: [],
  nodes: [],
  onEdgesChange: () => {},
  onNodesChange: () => {},
  updateAttributes: () => {},
});

interface TreegeFlowProviderProps {
  children: ReactNode;
}

export const TreegeFlowProvider = ({ children }: TreegeFlowProviderProps) => {
  const { nodes, edges, onNodesChange, onEdgesChange, updateNodeAttributes } = useTreegeFlow();

  const value = useMemo<TreegeFlowContextValue>(
    () => ({
      edges,
      nodes,
      onEdgesChange,
      onNodesChange,
      updateAttributes: updateNodeAttributes,
    }),
    [nodes, edges, onNodesChange, onEdgesChange, updateNodeAttributes],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
