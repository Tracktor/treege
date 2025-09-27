import { Connection, Edge, Node, useEdgesState, useNodesState } from "@xyflow/react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { TreegeFlowContext, TreegeFlowContextValue } from "@/context/TreegeFlow/TreegeFlowContext";
import dagreLayout from "@/features/TreegeFlow/Layout/dagre/dagreLayout";
import elkLayout from "@/features/TreegeFlow/Layout/ELK/elkLayout";
import useLaidOutGraph from "@/features/TreegeFlow/Layout/useLaidOutGraph";
import { TreeEdge, TreeGraph, TreeNode, TreeNodeData } from "@/features/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

const EMPTY_GRAPH: TreeGraph = { edges: [], nodes: [] };

interface TreegeFlowProviderProps {
  children: ReactNode;
  initialGraph?: TreeGraph;
}

const TreegeFlowProvider = ({ children, initialGraph }: TreegeFlowProviderProps) => {
  const [graph, setGraph] = useState<TreeGraph>(initialGraph ?? EMPTY_GRAPH);

  const [layoutEngineName, setLayoutEngineName] = useState<"dagre" | "elk">("elk");
  const layoutEngine = layoutEngineName === "dagre" ? dagreLayout : elkLayout;

  const { nodes: laidOutNodes, edges: laidOutEdges } = useLaidOutGraph(graph, layoutEngine);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<TreeNodeData>>(laidOutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(laidOutEdges);

  const getEdgeId = useCallback(() => `edge-${getUUID()}`, []);
  const getId = useCallback((prefix = "node") => `${prefix}-${getUUID()}`, []);

  /** Add a new TreeNode to the graph */
  const addNode = useCallback(
    (parentId?: string, attrs?: Partial<TreeNode["attributes"]> & { childId?: string; children?: TreeNode[] }) => {
      setGraph((prev) => {
        const newNodeId = getId("node");

        const { childId, children: nodeChildren, ...nodeAttrs } = attrs ?? {};
        const attributes: TreeNode["attributes"] =
          "type" in nodeAttrs
            ? {
                depth: 0,
                isDecision: nodeAttrs.isDecision,
                label: nodeAttrs.label ?? "",
                name: nodeAttrs.name ?? "Node",
                type: nodeAttrs.type ?? "text",
                values: nodeAttrs.values,
              }
            : {
                depth: 0,
                label: nodeAttrs.label ?? "",
                message: nodeAttrs.message,
                name: nodeAttrs.name ?? "Node",
                value: nodeAttrs.value ?? "",
              };

        const newNode: TreeNode = {
          attributes,
          children: nodeChildren ?? [],
          uuid: newNodeId,
        };

        if (!parentId) {
          return { edges: prev.edges, nodes: [...prev.nodes, newNode] };
        }

        const newEdges: TreeEdge[] = childId
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

  /** Update a node’s attributes & children */
  const updateNode = useCallback((nodeId: string, attributes: TreeNode["attributes"], newChildren?: TreeNode[]) => {
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

  /** Add a child TreeNode */
  const addChild = useCallback((nodeId: string, child: TreeNode) => {
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

  /** Delete node & reconnect parents to children */
  const deleteNode = useCallback(
    (nodeId: string) => {
      setGraph((prev) => {
        const parentEdges = prev.edges.filter((e) => e.target === nodeId);
        const childEdges = prev.edges.filter((e) => e.source === nodeId);

        const parents = parentEdges.map((e) => e.source);
        const newChildren = childEdges.map((e) => e.target);

        const remainingEdges = prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
        const remainingNodes = prev.nodes.filter((n) => n.uuid !== nodeId);

        const newEdges: TreeEdge[] = [];
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

  /** Handle new edge creation */
  const onConnect = useCallback(
    (connection: Connection) => {
      setGraph((prev) => {
        if (!connection.source || !connection.target) return prev;

        const exists = prev.edges.some((e) => e.source === connection.source && e.target === connection.target);
        if (exists) return prev;

        const newEdge: TreeEdge = {
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
    [getEdgeId],
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
      layoutEngineName,
      nodes,
      onConnect,
      onEdgesChange,
      onNodesChange,
      setGraph,
      setLayoutEngineName,
      updateNode,
    }),
    [addChild, addNode, deleteEdge, deleteNode, edges, graph, nodes, onConnect, onEdgesChange, onNodesChange, updateNode, layoutEngineName],
  );

  return <TreegeFlowContext.Provider value={value}>{children}</TreegeFlowContext.Provider>;
};

export default TreegeFlowProvider;
