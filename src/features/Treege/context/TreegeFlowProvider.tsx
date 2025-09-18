import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { createContext, ReactNode, useMemo, useState, useCallback, useEffect, useRef } from "react";
import minimalGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/data";
import { MinimalGraph, MinimalNode, MinimalEdge, Attributes, NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import useLayoutedGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/useLayoutedGraph";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

// 🔹 Génère nodes/edges option dans le graphe minimal
const expandMinimalGraphWithAttributes = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  graph.nodes.forEach((node) => {
    node.data.attributes?.forEach((attr, index) => {
      const childId = `${node.id}-attr-${index}`;

      if (!graph.nodes.find((n) => n.id === childId) && !extraNodes.find((n) => n.id === childId)) {
        extraNodes.push({
          data: {
            attributes: [],
            name: `${attr.key}: ${attr.value}`,
            type: "option",
          },
          id: childId,
        });

        extraEdges.push({
          id: `edge-${node.id}-attr-${index}`,
          source: node.id,
          target: childId,
          type: "option",
        });
      }
    });
  });

  return {
    edges: [...graph.edges, ...extraEdges],
    nodes: [...graph.nodes, ...extraNodes],
  };
};

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
  const [graph, setGraphRaw] = useState<MinimalGraph>(expandMinimalGraphWithAttributes(initialGraph ?? minimalGraph));

  // Générateur d’IDs intégré
  const countersRef = useRef<Record<string, number>>({});
  const getId = useCallback((prefix = "node") => {
    countersRef.current[prefix] = (countersRef.current[prefix] ?? 0) + 1;
    return `${prefix}-${countersRef.current[prefix]}`;
  }, []);

  // 🔹 setter qui expanse automatiquement
  const setGraph = useCallback((g: MinimalGraph) => {
    setGraphRaw(expandMinimalGraphWithAttributes(g));
  }, []);

  /** 🔹 Ajoute ou insère un node dans le graphe minimal */
  const addNodeToGraph = useCallback(
    (parentId: string, options?: NodeOptions & { childId?: string }) => {
      setGraphRaw((prev) => {
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

        let newGraph: MinimalGraph;

        if (options?.childId) {
          const { childId } = options;

          const filteredEdges = prev.edges.filter((e) => !(e.source === parentId && e.target === childId));

          newGraph = {
            edges: [
              ...filteredEdges,
              {
                id: getId("edge"),
                source: parentId,
                target: newNodeId,
              },
              {
                id: getId("edge"),
                source: newNodeId,
                target: childId,
              },
            ],
            nodes: [...prev.nodes, newNode],
          };
        } else {
          newGraph = {
            edges: [
              ...prev.edges,
              {
                id: getId("edge"),
                source: parentId,
                target: newNodeId,
              },
            ],
            nodes: [...prev.nodes, newNode],
          };
        }

        // 🔹 on expanse pour avoir aussi les nodes option
        return expandMinimalGraphWithAttributes(newGraph);
      });
    },
    [getId],
  );

  /** 🔹 Met à jour les attributes d’un node minimal */
  const updateNodeAttributes = useCallback((nodeId: string, attributes: Attributes[]) => {
    setGraphRaw((prev) => {
      const updated: MinimalGraph = {
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, attributes } } : n)),
      };

      // recalcul nodes/edges option
      return expandMinimalGraphWithAttributes(updated);
    });
  }, []);

  /** 🔹 Graphe layouté */
  const { nodes: layoutedNodes, edges: layoutedEdges } = useLayoutedGraph(graph);

  /** 🔹 État contrôlé React Flow */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(layoutedEdges);

  /** 🔹 Injection onAddNode dans chaque node layouté */
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
