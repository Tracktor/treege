import { useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { defaultNode } from "@/editor/constants/defaultNode";

/**
 * Custom hook to add a new node connected to a source node
 */
const useAddConnectedNode = () => {
  const { addNodes, addEdges, getNode, getNodes, setNodes, setEdges } = useReactFlow();

  /**
   * Adds a new node below the source node and creates an edge connecting them
   * @param sourceNodeId - The ID of the source node to connect from
   */
  const addConnectedNode = useCallback(
    (sourceNodeId: string) => {
      const sourceNode = getNode(sourceNodeId);
      if (!sourceNode) {
        return;
      }

      // Calculate position for the new node (below the source node)
      const rawNodeHeight = getComputedStyle(document.documentElement).getPropertyValue("--node-height");
      const rawNodeWidth = getComputedStyle(document.documentElement).getPropertyValue("--node-width");
      const nodeHeight = parseFloat(rawNodeHeight) || 100;
      const nodeWidth = parseFloat(rawNodeWidth) || 100;
      const verticalSpacing = 100;
      const horizontalOffset = 50;
      const newNodeId = nanoid();

      // Base position below the source node
      let newX = sourceNode.position.x;
      const newY = sourceNode.position.y + nodeHeight + verticalSpacing;

      // Check if there are already nodes at this position and offset horizontally
      const allNodes = getNodes();
      const positionTolerance = 20; // Tolerance for position comparison

      // Find nodes at the same Y (within tolerance)
      const nodesAtSameY = allNodes.filter((node) => Math.abs(node.position.y - newY) < positionTolerance);

      // If there are nodes at the same Y, place the new node to the right of the rightmost one
      if (nodesAtSameY.length > 0) {
        const rightmostNode = nodesAtSameY.reduce((max, node) => (node.position.x > max.position.x ? node : max), nodesAtSameY[0]);
        // Add nodeWidth to ensure no overlap, plus horizontalOffset spacing
        newX = rightmostNode.position.x + nodeWidth + horizontalOffset;
      }

      const newNode = {
        ...defaultNode,
        id: newNodeId,
        position: {
          x: newX,
          y: newY,
        },
        selected: true,
      };

      const newEdge = {
        id: nanoid(),
        source: sourceNodeId,
        target: newNodeId,
        type: "default",
      };

      // Deselect all nodes and edges before adding the new node
      setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })));
      setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })));

      // Add the new node and edge
      addNodes([newNode]);
      addEdges([newEdge]);
    },
    [addEdges, addNodes, getNode, getNodes, setNodes, setEdges],
  );

  return { addConnectedNode };
};

export default useAddConnectedNode;
