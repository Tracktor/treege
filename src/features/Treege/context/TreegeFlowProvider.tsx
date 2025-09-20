import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect, useRef } from "react";
import useLaidOutGraph from "@/features/Treege/TreegeFlow/Layout/useLaidOutGraph";
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
  addNode: (parentId?: string, attrs?: Attributes & { childId?: string; children?: Attributes[] }) => void;
  deleteNode: (nodeId: string) => void;
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addChild: () => {},
  addNode: () => {},
  deleteNode: () => {},
  edges: [],
  graph: { edges: [], nodes: [] },
  nodes: [],
  onEdgesChange: () => {},
  onNodesChange: () => {},
  setGraph: () => {},
  updateNode: () => {},
});

const EMPTY_GRAPH: MinimalGraph = { edges: [], nodes: [] };

interface TreegeFlowProviderProps {
  children: ReactNode;
  initialGraph?: MinimalGraph;
}

/**
 * TreegeFlowProvider
 *
 * React context provider for managing a Treege flow graph.
 *
 * This provider:
 * - Stores and updates the underlying MinimalGraph state.
 * - Keeps React Flow's `nodes` and `edges` in sync with the graph.
 * - Exposes convenient helpers (`addNode`, `updateNode`, `addChild`) to modify the graph.
 *
 * Typical usage:
 * ```tsx
 * <TreegeFlowProvider initialGraph={myGraph}>
 *   <MyTreegeEditor />
 * </TreegeFlowProvider>
 * ```
 *
 * Then inside any descendant component:
 * ```tsx
 * const { nodes, edges, addNode, updateNode } = useContext(TreegeFlowContext);
 * ```
 *
 * @param children - React children that will have access to the context.
 * @param initialGraph - Optional initial minimal graph to bootstrap the provider.
 */
const TreegeFlowProvider = ({ children, initialGraph }: TreegeFlowProviderProps) => {
  const countersRef = useRef<Record<string, number>>({});
  const [graph, setGraph] = useState<MinimalGraph>(initialGraph ?? EMPTY_GRAPH);
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
    (parentId?: string, attrs?: Attributes & { childId?: string; children?: Attributes[] }) => {
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

        if (!parentId) {
          return {
            edges: prev.edges,
            nodes: [...prev.nodes, newNode],
          };
        }

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

  /** Delete a node and reconnect its parents to its children */
  const deleteNode = useCallback(
    (nodeId: string) => {
      setGraph((prev) => {
        const parentEdges = prev.edges.filter((e) => e.target === nodeId);
        const childEdges = prev.edges.filter((e) => e.source === nodeId);

        const parents = parentEdges.map((e) => e.source);
        const newChildren = childEdges.map((e) => e.target);

        const remainingEdges = prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

        const remainingNodes = prev.nodes.filter((n) => n.id !== nodeId);

        const newEdges: MinimalEdge[] = [];
        parents.forEach((p) => {
          newChildren.forEach((c) => {
            // éviter doublon
            const alreadyExists = remainingEdges.some((e) => e.source === p && e.target === c);
            if (!alreadyExists) {
              newEdges.push({
                id: getId("edge"),
                source: p,
                target: c,
              });
            }
          });
        });

        return {
          edges: [...remainingEdges, ...newEdges],
          nodes: remainingNodes,
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
      deleteNode,
      edges,
      graph,
      nodes,
      onEdgesChange,
      onNodesChange,
      setGraph,
      updateNode,
    }),
    [addChild, addNode, deleteNode, edges, graph, nodes, onEdgesChange, onNodesChange, updateNode],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
