import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import minimalGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/data";
import { MinimalGraph, MinimalNode, MinimalEdge, Attributes, NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import useLayoutedGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/useLayoutedGraph";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: MinimalGraph;
  setGraph: (g: MinimalGraph) => void;
  onNodesChange: (nodes: Node<CustomNodeData>[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  updateAttributes: (nodeId: string, attributes: Attributes[]) => void;
  addNode: (parentId: string, options?: NodeOptions & { childId?: string }) => void;
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addNode: () => {},
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
  const [graph, setGraph] = useState<MinimalGraph>(initialGraph ?? minimalGraph);
  const getId = useIdGenerator();

  /** Ajoute ou insère un node dans le graphe minimal */
  const addNodeToGraph = useCallback(
    (parentId: string, options?: NodeOptions & { childId?: string }) => {
      setGraph((prev) => {
        const newNodeId = getId("node");

        const newNode: MinimalNode = {
          data: {
            attributes: options?.attributes ?? [],
            isDecision: options?.isDecision ?? false,
            name: options?.name ?? "Node",
            type: options?.type ?? "text",
          },
          id: newNodeId,
        };

        if (options?.childId) {
          const { childId } = options;

          const filteredEdges = prev.edges.filter((e) => !(e.source === parentId && e.target === childId));

          const edge1: MinimalEdge = {
            id: getId("edge"),
            source: parentId,
            target: newNodeId,
          };

          const edge2: MinimalEdge = {
            id: getId("edge"),
            source: newNodeId,
            target: childId,
          };

          return {
            edges: [...filteredEdges, edge1, edge2],
            nodes: [...prev.nodes, newNode],
          };
        }

        const newEdge: MinimalEdge = {
          id: getId("edge"),
          source: parentId,
          target: newNodeId,
        };

        return {
          edges: [...prev.edges, newEdge],
          nodes: [...prev.nodes, newNode],
        };
      });
    },
    [getId],
  );

  /** Met à jour les attributes d’un node minimal */
  const updateNodeAttributes = useCallback((nodeId: string, attributes: Attributes[]) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, attributes } } : n)),
    }));
  }, []);

  /** Graphe layouté */
  const { nodes: layoutedNodes, edges: layoutedEdges } = useLayoutedGraph(graph);

  /** État contrôlé React Flow */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(layoutedEdges);

  /** Injection onAddNode dans chaque node layouté */
  useEffect(() => {
    const nodesWithAdd = layoutedNodes.map((n) => ({
      ...n,
      data: { ...n.data, onAddNode: addNodeToGraph },
    }));
    setNodes(nodesWithAdd);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, addNodeToGraph, setNodes, setEdges]);

  const value = useMemo<TreegeFlowContextValue>(
    () => ({
      addNode: addNodeToGraph,
      edges,
      graph,
      nodes,
      onEdgesChange,
      onNodesChange,
      setGraph,
      updateAttributes: updateNodeAttributes,
    }),
    [edges, nodes, graph, onEdgesChange, onNodesChange, setGraph, updateNodeAttributes, addNodeToGraph],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
