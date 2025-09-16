import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIdGenerator } from "@/features/Treege/context/IDProvider";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export const useTreegeFlow = () => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [graphNodes, setGraphNodes] = useState<Node<CustomNodeData>[]>([]);
  const [graphEdges, setGraphEdges] = useState<Edge[]>([]);

  const initialized = useRef(false);
  const getId = useIdGenerator();

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

  const handleAddNode = useCallback(
    (parentId: string, childId?: string) => {
      setGraphNodes((currentNodes) => {
        const parentNode = currentNodes.find((n) => n.id === parentId);
        if (!parentNode) return currentNodes;

        // auto-pick correct child if not provided
        let effectiveChildId = childId;
        if (!effectiveChildId) {
          const childCandidates = graphEdges
            .filter((e) => e.source === parentId)
            .map((e) => currentNodes.find((n) => n.id === e.target))
            .filter(Boolean) as Node<CustomNodeData>[];

          if (childCandidates.length > 0) {
            const sorted = childCandidates.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
            // pick the first in order
            effectiveChildId = sorted[0].id;
          }
        }

        // determine order
        let newOrder: number;
        if (effectiveChildId) {
          const childNode = currentNodes.find((n) => n.id === effectiveChildId);
          const parentOrder = parentNode.data.order ?? 0;
          const childOrder = childNode?.data.order ?? parentOrder + 1;
          newOrder = (parentOrder + childOrder) / 2;
        } else {
          const parentOrder = parentNode.data.order ?? currentNodes.length;
          newOrder = parentOrder + 1;
        }

        const newId = getId("node");

        const newNode: Node<CustomNodeData> = {
          data: {
            name: `Node`,
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

          if (effectiveChildId) {
            newEdges = newEdges.filter((e) => !(e.source === parentId && e.target === effectiveChildId));

            newEdges.push({
              id: getId("edge"),
              source: parentId,
              target: newId,
              type: "smoothstep",
            });
            newEdges.push({
              id: getId("edge"),
              source: newId,
              target: effectiveChildId,
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

        return normalizeOrder(newNodes);
      });
    },
    [getId, graphEdges],
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
