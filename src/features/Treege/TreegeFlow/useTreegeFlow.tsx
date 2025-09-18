import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { CustomNodeData, NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

/**
 * Hook pour gérer le flow Treege :
 * - onAddNode(parentId) = ajoute un node à la suite
 * - onAddNode(parentId, childId) = insère entre deux nodes
 * - onAddNode(parentId, undefined, {sourceHandle}) = branche boolean
 */
export const useTreegeFlow = () => {
  const { fitView } = useReactFlow();

  // états ReactFlow
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // états “brut” pour builder le graphe
  const [graphNodes, setGraphNodes] = useState<Node<CustomNodeData>[]>([]);
  const [graphEdges, setGraphEdges] = useState<Edge[]>([]);

  const initialized = useRef(false);
  const getId = useIdGenerator();

  /** Normalise l’ordre des nœuds */
  const normalizeOrder = (nodeArray: Node<CustomNodeData>[]) => {
    const sorted = [...nodeArray].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    return sorted.map((n, index) => ({
      ...n,
      data: {
        ...n.data,
        order: index + 1,
      },
    }));
  };

  /**
   * Ajoute un nouveau nœud
   * - parentId : toujours requis
   * - childId : si défini → insertion entre parent et child
   * - options.sourceHandle : si défini → branche boolean
   */
  const handleAddNode = useCallback(
    (parentId: string, childId?: string, options?: NodeOptions) => {
      setGraphNodes((currentNodes) => {
        const parentNode = currentNodes.find((n) => n.id === parentId);
        if (!parentNode) return currentNodes;

        // Détermine l’ordre
        let newOrder: number;
        if (childId) {
          const childNode = currentNodes.find((n) => n.id === childId);
          const parentOrder = parentNode.data.order ?? 0;
          const childOrder = childNode?.data.order ?? parentOrder + 1;
          newOrder = (parentOrder + childOrder) / 2;
        } else {
          const parentOrder = parentNode.data.order ?? currentNodes.length;
          newOrder = parentOrder + 1;
        }

        // Crée un nouvel ID pour le node
        const newId = getId("node");

        const newNode: Node<CustomNodeData> = {
          data: {
            isDecision: options?.isDecision ?? false,
            name: options?.name ?? `Node`,
            onAddNode: handleAddNode,
            order: newOrder,
            type: options?.type ?? "text",
          },
          id: newId,
          position: { x: 0, y: 0 },
          type: options?.type ?? "text",
        };

        // Ajoute le node dans la liste
        const indexParent = currentNodes.findIndex((n) => n.id === parentId);
        const newNodes = [...currentNodes.slice(0, indexParent + 1), newNode, ...currentNodes.slice(indexParent + 1)];

        // 🔹 Gestion des edges
        setGraphEdges((currentEdges) => {
          let newEdges = [...currentEdges];

          if (options?.sourceHandle) {
            // Branche booléenne
            newEdges.push({
              id: getId("edge"),
              source: parentId,
              sourceHandle: options.sourceHandle,
              target: newId,
              type: "orthogonal",
            });
          } else if (childId) {
            // On insère entre deux nœuds existants
            newEdges = newEdges.filter((e) => !(e.source === parentId && e.target === childId));
            newEdges.push({
              id: getId("edge"),
              source: parentId,
              target: newId,
              type: "orthogonal",
            });
            newEdges.push({
              id: getId("edge"),
              source: newId,
              target: childId,
              type: "orthogonal",
            });
          } else {
            // Ajout simple
            newEdges.push({
              id: getId("edge"),
              source: parentId,
              target: newId,
              type: "orthogonal",
            });
          }

          return newEdges;
        });

        return normalizeOrder(newNodes);
      });
    },
    [getId],
  );

  /** 🔹 Nettoie edges orphelins à chaque changement de nodes */
  useEffect(() => {
    setGraphEdges((currentEdges) =>
      currentEdges.filter((e) => graphNodes.some((n) => n.id === e.source) && graphNodes.some((n) => n.id === e.target)),
    );
  }, [graphNodes]);

  /** 🔹 Recalcule layout ELK */
  useEffect(() => {
    if (graphNodes.length === 0) return;

    (async () => {
      const layout = await getLayout(graphNodes, graphEdges);

      setNodes(
        layout.nodes.map((n) => ({
          ...n,
          data: { ...n.data, onAddNode: handleAddNode },
        })),
      );
      setEdges(layout.edges);

      await fitView({ duration: 800, padding: 0.3 });
    })();
  }, [graphNodes, graphEdges, setNodes, setEdges, fitView, handleAddNode]); // plus de setGraphEdges ici

  /** 🔹 Init avec un node racine */
  useEffect(() => {
    if (!initialized.current) {
      const rootId = getId("root");
      const initialNode: Node<CustomNodeData> = {
        data: {
          name: "Node 1",
          onAddNode: handleAddNode,
          order: 1,
        },
        id: rootId,
        position: { x: 0, y: 0 },
        type: "text",
      };
      setGraphNodes([initialNode]);
      setGraphEdges([]);
      initialized.current = true;
    }
  }, [handleAddNode, getId]);

  return { edges, nodes, onEdgesChange, onNodesChange };
};

export default useTreegeFlow;
