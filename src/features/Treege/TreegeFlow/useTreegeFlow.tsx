import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";
import { getUUID } from "@/utils";

const useTreegeFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const initialized = useRef(false);

  const handleAddNode = useCallback(
    async (parentId: string, childId?: string) => {
      setNodes((currentNodes) => {
        const parentExists = currentNodes.find((n) => n.id === parentId);
        if (!parentExists) return currentNodes;

        const newId = `node-${getUUID()}`;

        const newNode: Node<CustomNodeData> = {
          data: { name: `Node ${currentNodes.length + 1}`, onAddNode: handleAddNode },
          id: newId,
          position: { x: 0, y: 0 },
          type: "text",
        };

        const newNodes = [...currentNodes, newNode];
        setEdges((currentEdges) => {
          let newEdges = [...currentEdges];

          if (childId) {
            const parentToChildEdge = newEdges.find((e) => e.source === parentId && e.target === childId);

            if (parentToChildEdge) {
              newEdges = newEdges.filter((e) => e.id !== parentToChildEdge.id);
            }

            newEdges.push({
              id: `e-${parentId}-to-${newId}-${getUUID()}`,
              source: parentId,
              target: newId,
              type: "smoothstep",
            });
            newEdges.push({
              id: `e-${newId}-to-${childId}-${getUUID()}`,
              source: newId,
              target: childId,
              type: "smoothstep",
            });
          } else {
            newEdges.push({
              id: `e-${parentId}-to-${newId}-${getUUID()}`,
              source: parentId,
              target: newId,
              type: "smoothstep",
            });
          }

          (async () => {
            try {
              const layout = await getLayout(newNodes, newEdges);

              setNodes(
                layout.nodes.map((n) => ({
                  ...n,
                  data: { ...n.data, onAddNode: handleAddNode },
                })),
              );
              setEdges(layout.edges);

              await fitView({ duration: 800, padding: 0.3 });
            } catch (error) {
              console.error("Erreur lors du calcul du layout:", error);
            }
          })();

          return newEdges;
        });

        return newNodes;
      });
    },
    [setNodes, setEdges, fitView],
  );

  // Init first node
  useEffect(() => {
    if (!initialized.current) {
      const rootId = `root-${getUUID()}`;
      const initialNode: Node<CustomNodeData> = {
        data: { name: "Node 1", onAddNode: handleAddNode },
        id: rootId,
        position: { x: 0, y: 0 },
        type: "text",
      };

      setNodes([initialNode]);
      initialized.current = true;
    }
  }, [handleAddNode, setNodes]);

  return { edges, nodes, onEdgesChange, onNodesChange };
};

export default useTreegeFlow;
