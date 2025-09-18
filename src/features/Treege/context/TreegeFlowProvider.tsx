// TreegeFlowProvider.tsx
import { Node, Edge, useNodesState, useEdgesState, OnNodesChange, OnEdgesChange } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect, useRef } from "react";
import minimalGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/data";
import { MinimalEdge, MinimalGraph, MinimalNode, NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import useLayoutedGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/useLayoutedGraph";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: MinimalGraph;
  setGraph: (g: MinimalGraph) => void;
  onNodesChange: OnNodesChange<Node<CustomNodeData>>;
  onEdgesChange: OnEdgesChange<Edge>;
  updateNode: (nodeId: string, attributes: NodeOptions) => void;
  addOption: (nodeId: string, option: NodeOptions) => void;
  addNode: (parentId: string, options?: NodeOptions & { childId?: string }) => void;
}

const normalizeNodeOptions = (opt?: Partial<NodeOptions>): NodeOptions => ({
  isDecision: opt?.isDecision,
  label: opt?.label ?? "",
  name: opt?.name ?? "",
  sourceHandle: opt?.sourceHandle,
  type: opt?.type,
  value: opt?.value ?? "",
});

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({} as TreegeFlowContextValue);

export const TreegeFlowProvider = ({ children, initialGraph }: { children: ReactNode; initialGraph?: MinimalGraph }) => {
  const [graph, setGraph] = useState<MinimalGraph>(initialGraph ?? minimalGraph);

  // ID generator
  const countersRef = useRef<Record<string, number>>({});
  const getId = useCallback((prefix = "node") => {
    countersRef.current[prefix] = (countersRef.current[prefix] ?? 0) + 1;
    return `${prefix}-${countersRef.current[prefix]}`;
  }, []);

  /** Add node */
  const addNode = useCallback(
    (parentId: string, options?: NodeOptions & { childId?: string }) => {
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
          options: [],
        };

        let newEdges: MinimalEdge[];

        if (options?.childId) {
          const { childId } = options;
          const filteredEdges = prev.edges.filter((e) => !(e.source === parentId && e.target === childId));

          newEdges = [
            ...filteredEdges,
            { id: getId("edge"), source: parentId, target: newNodeId },
            { id: getId("edge"), source: newNodeId, target: childId },
          ];
        } else {
          newEdges = [...prev.edges, { id: getId("edge"), source: parentId, target: newNodeId }];
        }

        return {
          edges: newEdges,
          nodes: [...prev.nodes, newNode],
        };
      });
    },
    [getId],
  );

  /** Update node attributes */
  const updateNode = useCallback((nodeId: string, attributes: NodeOptions) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, attributes } : n)),
    }));
  }, []);

  /** Add option */
  const addOption = useCallback((nodeId: string, option: NodeOptions) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, options: [...n.options, option] } : n)),
    }));
  }, []);

  /** Layouted graph */
  const { nodes: layoutedNodes, edges: layoutedEdges } = useLayoutedGraph(graph);

  /** ReactFlow controlled state */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(layoutedEdges);

  /** Inject addNode */
  useEffect(() => {
    const nodesWithAdd = layoutedNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onAddNode: (parentId: string, childId?: string, options?: Partial<NodeOptions>) => {
          const normalized = normalizeNodeOptions(options);
          addNode(parentId, { ...normalized, childId });
        },
      },
    }));
    setNodes(nodesWithAdd);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, addNode, setNodes, setEdges]);

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
