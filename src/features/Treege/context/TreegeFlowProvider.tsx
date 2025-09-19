import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect, useRef } from "react";
import minimalGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/data";
import useLaidOutGraph from "@/features/Treege/TreegeFlow/Layout/useLaidOutGraph";
import { CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode, NodeOptions } from "@/features/Treege/TreegeFlow/utils/types";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: MinimalGraph;
  setGraph: (g: MinimalGraph) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  updateNode: (nodeId: string, attributes: NodeOptions) => void;
  addOption: (nodeId: string, option: NodeOptions) => void;
  addNode: (parentId: string, options?: NodeOptions & { childId?: string; options?: NodeOptions[] }) => void;
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addNode: () => {},
  addOption: () => {},
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

  // --- ID generator ---
  const getId = useCallback((prefix = "node") => {
    countersRef.current[prefix] = (countersRef.current[prefix] ?? 0) + 1;
    return `${prefix}-${countersRef.current[prefix]}`;
  }, []);

  const addNode = useCallback(
    (parentId: string, options?: NodeOptions & { childId?: string; options?: NodeOptions[] }) => {
      setGraph((prev) => {
        const newNodeId = getId("node");

        const newNode: MinimalNode = {
          attributes: {
            isDecision: options?.isDecision ?? false,
            label: options?.label ?? "",
            name: options?.name ?? "Node",
            sourceHandle: options?.sourceHandle,
            type: options?.type ?? "text",
            value: options?.value ?? "",
          },
          id: newNodeId,
          options: options?.options ?? [],
        };

        const childId = options?.childId;

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

  const updateNode = useCallback((nodeId: string, attributes: NodeOptions) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, attributes } : n)),
    }));
  }, []);

  const addOption = useCallback((nodeId: string, option: NodeOptions) => {
    setGraph((prev) => {
      const updatedNode = prev.nodes.find((n) => n.id === nodeId);
      if (!updatedNode) return prev;

      const newNode = {
        ...updatedNode,
        options: [...updatedNode.options, option],
      };

      return {
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? newNode : n)),
      };
    });
  }, []);

  // --- Sync React Flow state with laid-out graph ---
  useEffect(() => {
    // Map over all laid-out nodes to enrich them with an onAddNode callback
    const nodesWithAdd = laidOutNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onAddNode: (parentId: string, childId?: string, options?: Partial<NodeOptions>) => {
          addNode(parentId, {
            ...(options as NodeOptions),
            childId,
          });
        },
      },
    }));

    // Update React Flow state with enriched nodes and latest edges
    setNodes(nodesWithAdd);
    setEdges(laidOutEdges);
  }, [laidOutNodes, laidOutEdges, addNode, setNodes, setEdges]);

  const value = useMemo<TreegeFlowContextValue>(
    () => ({
      addNode,
      addOption,
      edges,
      graph,
      nodes,
      onEdgesChange,
      onNodesChange,
      setGraph,
      updateNode,
    }),
    [edges, nodes, graph, onEdgesChange, onNodesChange, setGraph, updateNode, addNode, addOption],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
