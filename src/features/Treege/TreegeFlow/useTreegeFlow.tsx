import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

/**
 * Hook TreegeFlow – version stable avec graphe brut et recalcul automatique du layout.
 */
export const useTreegeFlow = () => {
  const { fitView } = useReactFlow();

  // 1️⃣ états React Flow (ceux passés à <ReactFlow/>)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 2️⃣ graphe brut (sans positions ELK)
  const [graphNodes, setGraphNodes] = useState<Node<CustomNodeData>[]>([]);
  const [graphEdges, setGraphEdges] = useState<Edge[]>([]);

  const initialized = useRef(false);
  const getId = useIdGenerator();

  const handleAddNode = useCallback(
    (parentId: string, childId?: string) => {
      setGraphNodes((currentNodes) => {
        const parentExists = currentNodes.find((n) => n.id === parentId);
        if (!parentExists) return currentNodes;

        const newId = getId("node");
        const newNode: Node<CustomNodeData> = {
          data: {
            name: `Node ${currentNodes.length + 1}`,
            onAddNode: handleAddNode,
          },
          id: newId,
          position: { x: 0, y: 0 },
          type: "text",
        };

        const indexParent = currentNodes.findIndex((n) => n.id === parentId);
        const newNodes = [...currentNodes.slice(0, indexParent + 1), newNode, ...currentNodes.slice(indexParent + 1)];

        setGraphEdges((currentEdges) => {
          let newEdges = [...currentEdges];
          if (childId) {
            newEdges = newEdges.filter((e) => !(e.source === parentId && e.target === childId));

            newEdges.push({
              id: getId("edge"),
              source: parentId,
              target: newId,
              type: "smoothstep",
            });
            newEdges.push({
              id: getId("edge"),
              source: newId,
              target: childId,
              type: "smoothstep",
            });
          } else {
            newEdges.push({
              id: getId("edge"),
              source: parentId,
              target: newId,
              type: "smoothstep",
            });
          }
          return newEdges;
        });

        return newNodes;
      });
    },
    [getId],
  );

  /**
   * Re-compute ELK layout automatically when graphNodes/graphEdges change.
   */
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
  }, [graphNodes, graphEdges, fitView, handleAddNode, setNodes, setEdges]);

  /**
   * Init First Node
   */
  useEffect(() => {
    if (!initialized.current) {
      const rootId = getId("root");
      const initialNode: Node<CustomNodeData> = {
        data: { name: "Node 1", onAddNode: handleAddNode },
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
