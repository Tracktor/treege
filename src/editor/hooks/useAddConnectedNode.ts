import { useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { defaultNode } from "@/editor/constants/defaultNode";

/**
 * Custom hook to add a new node connected to a source node
 */
const useAddConnectedNode = () => {
  const { addNodes, addEdges, getNode, getNodes } = useReactFlow();

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
      const nodeHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--node-height"), 10);
      const nodeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--node-width"), 10);
      const verticalSpacing = 100; // Space between nodes
      const horizontalOffset = 50; // Horizontal offset when nodes overlap
      const newNodeId = nanoid();

      // Base position below the source node
      let newX = sourceNode.position.x;
      const newY = sourceNode.position.y + nodeHeight + verticalSpacing;

      // Check if there are already nodes at this position and offset horizontally
      const allNodes = getNodes();
      const positionTolerance = 20; // Tolerance for position comparison
      let offsetMultiplier = 0;

      // Count how many nodes are already at similar positions
      const nodesAtSamePosition = allNodes.filter((node) => {
        const sameY = Math.abs(node.position.y - newY) < positionTolerance;
        const nearX = Math.abs(node.position.x - (sourceNode.position.x + offsetMultiplier * horizontalOffset)) < nodeWidth + 20;
        return sameY && nearX;
      });

      // Apply horizontal offset based on how many nodes are already there
      offsetMultiplier = nodesAtSamePosition.length;
      newX = sourceNode.position.x + offsetMultiplier * horizontalOffset;

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

      // Add the new node and edge
      addNodes([newNode]);
      addEdges([newEdge]);
    },
    [addEdges, addNodes, getNode, getNodes],
  );

  return { addConnectedNode };
};

export default useAddConnectedNode;
