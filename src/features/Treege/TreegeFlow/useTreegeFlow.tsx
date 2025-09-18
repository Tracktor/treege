import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { Attributes, CustomNodeData, NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export const useTreegeFlow = () => {
  const { fitView } = useReactFlow();

  // états ReactFlow
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // états internes
  const [graphNodes, setGraphNodes] = useState<Node<CustomNodeData>[]>([]);
  const [graphEdges, setGraphEdges] = useState<Edge[]>([]);
  const initialized = useRef(false);
  const getId = useIdGenerator();

  /** Normalise l’ordre */
  const normalizeOrder = (nodeArray: Node<CustomNodeData>[]) => {
    const sorted = [...nodeArray].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    return sorted.map((n, index) => ({
      ...n,
      data: { ...n.data, order: index + 1 },
    }));
  };

  /** Met à jour les attributes sans toucher à l’ordre */
  const updateNodeAttributes = useCallback((nodeId: string, newAttributes: Attributes[]): void => {
    setGraphNodes((current: Node<CustomNodeData>[]) =>
      current.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                attributes: newAttributes,
                order: node.data.order,
              },
            }
          : node,
      ),
    );
  }, []);

  /** Ajoute un nouveau nœud */
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

        // Crée un nouvel ID
        const newId = getId("node");

        // ⚡️ Nouveau node – on prend exactement les attributs donnés par le modal
        const newNode: Node<CustomNodeData> = {
          data: {
            ...options,
            attributes: options?.attributes ?? [],
            name: options?.name ?? `Node`,
            onAddNode: handleAddNode,
            order: newOrder,
          },
          id: newId,
          position: { x: 0, y: 0 },
          type: options?.type ?? "text",
        };

        // Insert dans le tableau après le parent
        const indexParent = currentNodes.findIndex((n) => n.id === parentId);
        const newNodes = [...currentNodes.slice(0, indexParent + 1), newNode, ...currentNodes.slice(indexParent + 1)];

        // Gestion des edges
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

  /** Nettoie edges orphelins */
  useEffect(() => {
    setGraphEdges((currentEdges) =>
      currentEdges.filter((e) => graphNodes.some((n) => n.id === e.source) && graphNodes.some((n) => n.id === e.target)),
    );
  }, [graphNodes]);

  useEffect(() => {
    if (graphNodes.length === 0) return;

    // on accumule les nouveaux nodes/edges
    const addedNodes: Node<CustomNodeData>[] = [];
    const addedEdges: Edge[] = [];

    graphNodes.forEach((node) => {
      if (node.data?.attributes?.length > 0) {
        node.data.attributes.forEach((attr, index) => {
          // on construit un ID stable et prédictible
          const childId = `${node.id}-attr-${index}`;

          // Vérifie si déjà existant → si oui on ne le recrée pas
          const alreadyExists = graphNodes.find((n) => n.id === childId) || addedNodes.find((n) => n.id === childId);

          if (!alreadyExists) {
            // crée node enfant
            const childNode: Node<CustomNodeData> = {
              data: {
                attributes: [],
                name: `${attr.key}: ${attr.value}`,
                // enfant n’a pas d’attributs
                onAddNode: handleAddNode,
                order: (node.data.order ?? 0) + (index + 1) * 0.1,
              },
              id: childId,
              // ou ton type spécifique
              position: { x: 0, y: 0 },

              type: "text",
            };
            addedNodes.push(childNode);

            // crée edge parent → enfant
            addedEdges.push({
              id: getId("edge"),
              source: node.id,
              target: childId,
              type: "orthogonal",
            });
          }
        });
      }
    });

    if (addedNodes.length > 0 || addedEdges.length > 0) {
      // on ajoute en une fois à la fin (évite plusieurs renders)
      setGraphNodes((prev) => [...prev, ...addedNodes]);
      setGraphEdges((prev) => {
        const edgesSet = [...prev];
        addedEdges.forEach((edge) => {
          if (!edgesSet.find((e) => e.source === edge.source && e.target === edge.target)) {
            edgesSet.push(edge);
          }
        });
        return edgesSet;
      });
    }

    // ⚠️ ne mets PAS graphNodes dans les deps pour éviter la boucle
  }, [handleAddNode, getId, graphNodes]);

  /** Recalcule layout ELK */
  useEffect(() => {
    if (graphNodes.length === 0) return;

    (async () => {
      const layout = await getLayout(graphNodes, graphEdges);

      // Réinjecte seulement onAddNode
      setNodes(
        layout.nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            onAddNode: handleAddNode,
          },
        })),
      );
      setEdges(layout.edges);

      await fitView({ duration: 800, padding: 0.3 });
    })();
  }, [graphNodes, graphEdges, setNodes, setEdges, fitView, handleAddNode]);

  /** Init root */
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

  return {
    edges,
    nodes,
    onEdgesChange,
    onNodesChange,
    updateNodeAttributes,
  };
};

export default useTreegeFlow;
