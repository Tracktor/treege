import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { useState, useCallback, useEffect } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import { MinimalGraph, MinimalNode, MinimalEdge, Attributes, NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import useLayoutedGraph from "@/features/Treege/TreegeFlow/GraphDataMapper/useLayoutedGraph";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export const useTreegeFlow = (initialGraph: MinimalGraph) => {
  const [graph, setGraph] = useState<MinimalGraph>(initialGraph ?? { edges: [], nodes: [] });
  const getId = useIdGenerator();

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

  const updateNodeAttributes = useCallback((nodeId: string, attributes: Attributes[]) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, attributes } } : n)),
    }));
  }, []);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useLayoutedGraph(graph);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(layoutedEdges);

  useEffect(() => {
    const nodesWithAdd = layoutedNodes.map((n) => ({
      ...n,
      data: { ...n.data, onAddNode: addNodeToGraph },
    }));

    setNodes(nodesWithAdd);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, addNodeToGraph, setNodes, setEdges]);

  return {
    addNodeToGraph,
    edges,
    graph,
    nodes,
    onEdgesChange,
    onNodesChange,
    setGraph,
    updateNodeAttributes,
  };
};

export default useTreegeFlow;
