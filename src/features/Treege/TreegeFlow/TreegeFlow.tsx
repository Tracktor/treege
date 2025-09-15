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
      setNodes((currentNodes) => {
        const parentExists = currentNodes.find((n) => n.id === parentId);

        if (!parentExists) return currentNodes;

        const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
          type: "smoothstep",
        };

        const newNodes = [...currentNodes, newNode];

        setEdges((currentEdges) => {
          const newEdges = [...currentEdges, newEdge];

          // Appliquer le layout de manière asynchrone APRÈS avoir mis à jour les deux états
          setTimeout(async () => {
            try {
              const layoutNodes = await autoLayout(newNodes, newEdges);

              setNodes(
                layoutNodes.nodes.map((n) => ({
                  ...n,
                  data: { ...n.data, onAddNode: handleAddNode },
                })),
              );

              setTimeout(() => {
                fitView({ duration: 800, padding: 0.3 });
              }, 100);
            } catch (error) {
              // Fallback: position manuelle simple
              const fallbackNode = {
                ...newNode,
                position: {
                  x: parentExists.position.x + (Math.random() - 0.5) * 100,
                  y: parentExists.position.y + 200,
                },
              };

              setNodes([
                ...currentNodes,
                {
                  ...fallbackNode,
                  data: { ...fallbackNode.data, onAddNode: handleAddNode },
                },
              ]);
            }
          }, 0);

          return newEdges;
        });

        // Retourner les nouveaux nodes immédiatement
        return newNodes;
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
    <ReactFlow
      fitView
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={{
        markerEnd: {
          color: "#999",
          height: 20,
          type: "arrowclosed",
          width: 20,
        },
        style: { stroke: "#999", strokeWidth: 2 },
        type: "smoothstep",
      }}
    >
      <Controls />
    </ReactFlow>
  );
};

export default TreegeFlow;
