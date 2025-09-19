import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect, useRef } from "react";
import useLaidOutGraph from "@/features/Treege/TreegeFlow/Layout/useLaidOutGraph";
import minimalGraph from "@/features/Treege/TreegeFlow/utils/data";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: MinimalGraph;
  setGraph: (g: MinimalGraph) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  updateNode: (nodeId: string, attributes: Attributes) => void;
  addChild: (nodeId: string, child: Attributes) => void;
  addNode: (parentId: string, attrs?: Attributes & { childId?: string; children?: Attributes[] }) => void;
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addChild: () => {},
  addNode: () => {},
  edges: [],
  graph: { edges: [], nodes: [] },
  nodes: [],
  onEdgesChange: () => {},
  onNodesChange: () => {},
  setGraph: () => {},
  updateNode: () => {},
});

interface TreegeFlowProviderProps {
  children: ReactNode;
  initialGraph?: MinimalGraph;
}

const TreegeFlowProvider = ({ children, initialGraph }: TreegeFlowProviderProps) => {
  const countersRef = useRef<Record<string, number>>({});
  const [graph, setGraph] = useState<MinimalGraph>(initialGraph ?? minimalGraph);
  const { nodes: laidOutNodes, edges: laidOutEdges } = useLaidOutGraph(graph);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(laidOutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(laidOutEdges);

  /** ID generator for nodes and edges */
  const getId = useCallback((prefix = "node") => {
    countersRef.current[prefix] = (countersRef.current[prefix] ?? 0) + 1;
    return `${prefix}-${countersRef.current[prefix]}`;
  }, []);

  /** Add a new node to the graph (optionally between two existing nodes). */
  const addNode = useCallback(
    (parentId: string, attrs?: Attributes & { childId?: string; children?: Attributes[] }) => {
      setGraph((prev) => {
        const newNodeId = getId("node");

        const newNode: MinimalNode = {
          attributes: {
            isDecision: attrs?.isDecision ?? false,
            label: attrs?.label ?? "",
            name: attrs?.name ?? "Node",
            sourceHandle: attrs?.sourceHandle,
            type: attrs?.type ?? "text",
            value: attrs?.value ?? "",
          },
          children: attrs?.children ?? [],
          id: newNodeId,
        };

        const childId = attrs?.childId;

        const newEdges: MinimalEdge[] = childId
          ? [
              ...prev.edges.filter((e) => !(e.source === parentId && e.target === childId)),
              { id: getId("edge"), source: parentId, target: newNodeId },
              { id: getId("edge"), source: newNodeId, target: childId },
            ]
          : [...prev.edges, { id: getId("edge"), source: parentId, target: newNodeId }];

        return {
          edges: newEdges,
          nodes: [...prev.nodes, newNode],
        };
      });
    },
    [getId],
  );

  /** Update a node’s attributes */
  const updateNode = useCallback((nodeId: string, attributes: Attributes) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, attributes } : n)),
    }));
  }, []);

  /** Add a child (option) to a node */
  const addChild = useCallback((nodeId: string, child: Attributes) => {
    setGraph((prev) => {
      const updatedNode = prev.nodes.find((n) => n.id === nodeId);
      if (!updatedNode) return prev;

      const newNode = {
        ...updatedNode,
        children: [...updatedNode.children, child],
      };

      return {
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? newNode : n)),
      };
    });
  }, []);

  /** Sync React Flow state with laid-out graph */
  useEffect(() => {
    setNodes(laidOutNodes);
    setEdges(laidOutEdges);
  }, [laidOutNodes, laidOutEdges, addNode, setNodes, setEdges]);

  const value = useMemo<TreegeFlowContextValue>(
    () => ({
      addChild,
      addNode,
      edges,
      graph,
      nodes,
      onEdgesChange,
      onNodesChange,
      setGraph,
      updateNode,
    }),
    [edges, nodes, graph, onEdgesChange, onNodesChange, setGraph, updateNode, addNode, addChild],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
