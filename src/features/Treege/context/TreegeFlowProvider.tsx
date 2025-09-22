import { Node, Edge, useNodesState, useEdgesState, Connection, NodeChange, EdgeChange } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect } from "react";
import useLaidOutGraph from "@/features/Treege/TreegeFlow/Layout/useLaidOutGraph";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

export interface TreegeFlowContextValue {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: MinimalGraph;
  setGraph: (g: MinimalGraph) => void;
  onNodesChange: (changes: NodeChange<Node<CustomNodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateNode: (nodeId: string, attributes: Attributes, children?: MinimalNode[]) => void;
  addChild: (nodeId: string, child: MinimalNode) => void;
  addNode: (
    parentId?: string,
    attrs?: Attributes & {
      childId?: string;
      children?: MinimalNode[];
    },
  ) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
}

type AddNodeInput = Attributes & {
  childId?: string;
  children?: MinimalNode[];
};

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addChild: () => {},
  addNode: () => {},
  deleteEdge: () => {},
  deleteNode: () => {},
  edges: [],
  graph: { edges: [], nodes: [] },
  nodes: [],
  onConnect: () => {},
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

const TreegeFlowProvider = ({ children, initialGraph }: TreegeFlowProviderProps) => {
  const [graph, setGraph] = useState<MinimalGraph>(initialGraph ?? EMPTY_GRAPH);
  const { nodes: laidOutNodes, edges: laidOutEdges } = useLaidOutGraph(graph);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(laidOutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(laidOutEdges);

  /** ID generator for edges */
  const getEdgeId = useCallback(() => `edge-${getUUID()}`, []);
  const getId = useCallback((prefix = "node") => `${prefix}-${getUUID()}`, []);

  /** Add a new node to the graph (optionally between two existing nodes). */
  const addNode = useCallback(
    (parentId?: string, attrs?: AddNodeInput) => {
      setGraph((prev) => {
        const newNodeId = getId("node");

        const safeAttrs: AddNodeInput = attrs ?? {
          // valeurs par défaut
          isDecision: false,
          label: "",
          message: "",
          name: "Node",
          type: "text",
          value: "",
        };

        const { childId, children: nodeChildren, ...nodeAttrs } = safeAttrs;

        const attributes: Attributes = {
          isDecision: nodeAttrs.isDecision ?? false,
          label: nodeAttrs.label ?? "",
          message: nodeAttrs.message,
          name: nodeAttrs.name ?? "Node",
          sourceHandle: nodeAttrs.sourceHandle,
          type: nodeAttrs.type ?? "text",
          value: nodeAttrs.value ?? "",
        };

        const newNode: MinimalNode = {
          attributes,
          children: nodeChildren ?? [],
          uuid: newNodeId,
        };

        if (!parentId) {
          return { edges: prev.edges, nodes: [...prev.nodes, newNode] };
        }

        const newEdges: MinimalEdge[] = childId
          ? [
              ...prev.edges.filter((e) => !(e.source === parentId && e.target === childId)),
              { source: parentId, target: newNodeId, uuid: getId("edge") },
              { source: newNodeId, target: childId, uuid: getId("edge") },
            ]
          : [...prev.edges, { source: parentId, target: newNodeId, uuid: getId("edge") }];

        return { edges: newEdges, nodes: [...prev.nodes, newNode] };
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
        const remainingNodes = prev.nodes.filter((n) => n.uuid !== nodeId);

        const newEdges: MinimalEdge[] = [];
        parents.forEach((p) => {
          newChildren.forEach((c) => {
            const alreadyExists = remainingEdges.some((e) => e.source === p && e.target === c);
            if (!alreadyExists) {
              newEdges.push({
                source: p,
                target: c,
                uuid: getEdgeId(),
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
    [getEdgeId],
  );

  /** Update a node’s attributes & children */
  const updateNode = useCallback((nodeId: string, attributes: Attributes, newChildren?: MinimalNode[]) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.uuid === nodeId
          ? {
              ...n,
              attributes,
              children: newChildren ?? n.children,
            }
          : n,
      ),
    }));
  }, []);

  /** Add a child MinimalNode to a node */
  const addChild = useCallback((nodeId: string, child: MinimalNode) => {
    setGraph((prev) => {
      const updatedNode = prev.nodes.find((n) => n.uuid === nodeId);
      if (!updatedNode) return prev;

      const newNode = {
        ...updatedNode,
        children: [...updatedNode.children, child],
      };

      return {
        ...prev,
        nodes: prev.nodes.map((n) => (n.uuid === nodeId ? newNode : n)),
      };
    });
  }, []);

  /** Handle new edge creation */
  const onConnect = useCallback(
    (connection: Connection) => {
      setGraph((prev) => {
        // sécurité
        if (!connection.source || !connection.target) return prev;

        // empêcher les doublons
        const exists = prev.edges.some((e) => e.source === connection.source && e.target === connection.target);
        if (exists) return prev;

        const newEdge: MinimalEdge = {
          source: connection.source,
          target: connection.target,
          uuid: getEdgeId(),
        };

        return {
          ...prev,
          edges: [...prev.edges, newEdge],
        };
      });
    },
    [setGraph, getEdgeId],
  );

  /** Delete an edge by its uuid */
  const deleteEdge = useCallback((edgeId: string) => {
    setGraph((prev) => ({
      ...prev,
      edges: prev.edges.filter((e) => e.uuid !== edgeId),
    }));
  }, []);

  /** Sync React Flow state with laid-out graph */
  useEffect(() => {
    setNodes(laidOutNodes);
    setEdges(laidOutEdges);
  }, [laidOutNodes, laidOutEdges, setNodes, setEdges]);

  const value = useMemo<TreegeFlowContextValue>(
    () => ({
      addChild,
      addNode,
      deleteEdge,
      deleteNode,
      edges,
      graph,
      nodes,
      onConnect,
      onEdgesChange,
      onNodesChange,
      setGraph,
      updateNode,
    }),
    [addChild, addNode, deleteEdge, deleteNode, edges, graph, nodes, onConnect, onEdgesChange, onNodesChange, updateNode],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
