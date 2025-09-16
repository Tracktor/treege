import { ReactFlow, Controls, useEdgesState, useNodesState, useReactFlow, type Node, type Edge } from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
import getLayout from "@/features/Treege/getLayout/getLayout";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/Text";
import { getUUID } from "@/utils";

export type CustomNodeData = {
  name: string;
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

        const newId = `node-${getUUID()}`;

        const newNode: Node<CustomNodeData> = {
          data: { name: `Node ${currentNodes.length + 1}`, onAddNode: handleAddNode },
          id: newId,
          position: { x: 0, y: 0 },
          type: "text",
        };

        // ⚡ Ici, on utilise setEdges avec une updater function
        setEdges((currentEdges) => {
          const newEdge: Edge = {
            id: `e-${parentId}-to-${newId}-${getUUID()}`,
            source: parentId,
            target: newId,
            type: "smoothstep",
          };

          const newNodes = [...currentNodes, newNode];
          const newEdges = [...currentEdges, newEdge];

          (async () => {
            const layout = await getLayout(newNodes, newEdges);

            setNodes(
              layout.nodes.map((n) => ({
                ...n,
                data: { ...n.data, onAddNode: handleAddNode },
              })),
            );
            setEdges(layout.edges);

            await fitView({ duration: 800, padding: 0.3 });
          })();

          return newEdges;
        });

        return [...currentNodes, newNode];
      });
    },
    [setNodes, setEdges, fitView],
  );

  // Initialisation du premier nœud
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
