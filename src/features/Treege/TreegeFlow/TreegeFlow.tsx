import { ReactFlow, Controls, useEdgesState, useNodesState, useReactFlow, type Node, type Edge } from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
import autoLayout from "@/features/Treege/autoLayout/autoLayout";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/Text";

export type CustomNodeData = {
  label: string;
  onAddNode?: (parentId: string) => void;
};

const nodeTypes = {
  text: TextNode,
};

const TreegeFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const initialized = useRef(false);

  const handleAddNode = useCallback(
    async (parentId: string) => {
      console.log("handleAddNode called with parentId:", parentId);

      // Utiliser une fonction pour accéder à l'état actuel
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          console.log(
            "Current nodes in callback:",
            currentNodes.map((n) => n.id),
          );

          // Vérifier que le parent existe
          const parentExists = currentNodes.find((n) => n.id === parentId);
          if (!parentExists) {
            console.error(
              "Parent node not found:",
              parentId,
              "Available nodes:",
              currentNodes.map((n) => n.id),
            );
            return currentEdges; // Retourner les edges sans changement
          }

          // Générer un ID unique basé sur le timestamp
          const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          console.log("Creating new node with ID:", newId, "parent:", parentId);

          const newNode: Node<CustomNodeData> = {
            data: { label: `Node ${currentNodes.length + 1}`, onAddNode: handleAddNode },
            id: newId,
            position: { x: 0, y: 0 },
            type: "text",
          };

          const newEdge: Edge = {
            id: `e-${parentId}-to-${newId}`,
            source: parentId,
            target: newId,
          };

          console.log("Adding node:", newNode.id);
          console.log("Adding edge:", `${newEdge.source} -> ${newEdge.target}`);

          const newNodes = [...currentNodes, newNode];
          const newEdges = [...currentEdges, newEdge];

          // Appliquer le layout de manière asynchrone
          autoLayout(newNodes, newEdges)
            .then((layoutNodes) => {
              console.log("Layout successful, updating nodes");
              setNodes(
                layoutNodes.map((n) => ({
                  ...n,
                  data: { ...n.data, onAddNode: handleAddNode },
                })),
              );

              // Ajuster la vue après un court délai
              setTimeout(() => {
                fitView({ duration: 800, padding: 0.3 });
              }, 100);
            })
            .catch((error) => {
              console.error("Erreur lors du layout:", error);

              // Fallback: position manuelle simple
              const fallbackNode = {
                ...newNode,
                position: {
                  x: parentExists.position.x + (Math.random() - 0.5) * 200,
                  y: parentExists.position.y + 200,
                },
              };

              const fallbackNodes = [
                ...currentNodes,
                {
                  ...fallbackNode,
                  data: { ...fallbackNode.data, onAddNode: handleAddNode },
                },
              ];

              setNodes(fallbackNodes);
            });

          // Retourner les nouveaux edges immédiatement
          return newEdges;
        });

        // Retourner les nodes actuels pour l'instant (ils seront mis à jour par autoLayout)
        return currentNodes;
      });
    },
    [setNodes, setEdges, fitView],
  );

  // Initialisation du premier nœud (une seule fois)
  useEffect(() => {
    if (!initialized.current) {
      const initialNode: Node<CustomNodeData> = {
        data: { label: "Root Node", onAddNode: handleAddNode },
        id: "root-1",
        position: { x: 0, y: 0 },
        type: "text",
      };

      setNodes([initialNode]);
      initialized.current = true;
      console.log("Initial node created:", initialNode);
    }
  }, [handleAddNode, setNodes]);

  return (
    <ReactFlow fitView nodeTypes={nodeTypes} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
      <Controls />
    </ReactFlow>
  );
};

export default TreegeFlow;
