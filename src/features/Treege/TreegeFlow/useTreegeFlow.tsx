import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export const useTreegeFlow = () => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  console.log("edges", edges);
  console.log("nodes", nodes);

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
        const newOrder = currentNodes.length + 1;

        const newNode: Node<CustomNodeData> = {
          data: {
            name: `Node ${newOrder}`,
            // explicit order field
            onAddNode: handleAddNode,
            order: newOrder,
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

  useEffect(() => {
    if (!initialized.current) {
      const rootId = getId("root");
      const initialNode: Node<CustomNodeData> = {
        data: { name: "Node 1", onAddNode: handleAddNode, order: 1 },
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
