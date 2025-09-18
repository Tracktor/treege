// TreegeFlowProvider.tsx
import { Node, Edge } from "@xyflow/react";
import { createContext, ReactNode, useMemo } from "react";
import minimalGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/data";
import { MinimalGraph, Attributes, NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";
import useTreegeFlow from "@/features/Treege/TreegeFlow/useTreegeFlow";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: MinimalGraph;
  setGraph: (g: MinimalGraph) => void;
  onNodesChange: ReturnType<typeof useTreegeFlow>["onNodesChange"];
  onEdgesChange: ReturnType<typeof useTreegeFlow>["onEdgesChange"];
  updateAttributes: (nodeId: string, attributes: Attributes[]) => void;
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  edges: [],
  graph: { edges: [], nodes: [] },
  nodes: [],
  onEdgesChange: () => {},
  onNodesChange: () => {},
  setGraph: () => {},
  updateAttributes: () => {},
});

interface TreegeFlowProviderProps {
  children: ReactNode;
  initialGraph?: MinimalGraph;
}

export const TreegeFlowProvider = ({ children, initialGraph }: TreegeFlowProviderProps) => {
  const { nodes, edges, graph, setGraph, onNodesChange, onEdgesChange, updateNodeAttributes } = useTreegeFlow(initialGraph ?? minimalGraph);

  const value = useMemo<TreegeFlowContextValue>(
    () => ({
      edges,
      graph,
      nodes,
      onEdgesChange,
      onNodesChange,
      setGraph,
      updateAttributes: updateNodeAttributes,
    }),
    [edges, nodes, graph, setGraph, onNodesChange, onEdgesChange, updateNodeAttributes],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
