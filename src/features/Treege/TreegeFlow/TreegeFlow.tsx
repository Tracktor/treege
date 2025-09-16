import { ReactFlow, Controls, useEdgesState, useNodesState, useReactFlow, type Node, type Edge } from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
import getLayout from "@/features/Treege/getLayout/getLayout";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/Text";
import { getUUID } from "@/utils";

export type CustomNodeData = {
  name: string;
  onAddNode?: (parentId: string, childId?: string) => void;
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
    async (parentId: string, childId?: string) => {
      setNodes((currentNodes) => {
        const parentExists = currentNodes.find((n) => n.id === parentId);
        if (!parentExists) return currentNodes;

        const newId = `node-${getUUID()}`;

        const newNode: Node<CustomNodeData> = {
          // layout recalculé ensuite
          data: { name: `Node ${currentNodes.length + 1}`, onAddNode: handleAddNode },

          id: newId,

          position: { x: 0, y: 0 },
          type: "text",
        };

        setEdges((currentEdges) => {
          let newEdges = [...currentEdges];

          if (childId) {
            // On veut insérer entre parentId -> childId
            // 1. Supprimer l'edge existant
            newEdges = newEdges.filter((e) => !(e.source === parentId && e.target === childId));

            // 2. Ajouter les 2 nouveaux edges
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
            // Comportement par défaut : nouvelle branche
            newEdges.push({
              id: `e-${parentId}-to-${newId}-${getUUID()}`,
              source: parentId,
              target: newId,
              type: "smoothstep",
            });
          }

          const newNodes = [...currentNodes, newNode];

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

  return (
    <ReactFlow
      fitView
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={{
        style: { stroke: "#999", strokeDasharray: "1 3", strokeLinecap: "round", strokeWidth: 1 },
        type: "smoothstep",
      }}
    >
      <Controls />
    </ReactFlow>
  );
};

export default TreegeFlow;
