import { MouseEvent, useCallback } from "react";
import useAddConnectedNode from "@/editor/hooks/useAddConnectedNode";

/**
 * Custom hook to handle clicks on bottom handles of nodes
 * @param nodeId - The ID of the current node
 * @returns Click handler for the bottom handle
 */
const useBottomHandleClick = (nodeId: string) => {
  const { addConnectedNode } = useAddConnectedNode();

  const handleBottomHandleClick = useCallback(
    (event: MouseEvent) => {
      // Only trigger on direct click, not on drag
      if (event.defaultPrevented) {
        return;
      }
      addConnectedNode(nodeId);
    },
    [addConnectedNode, nodeId],
  );

  return handleBottomHandleClick;
};

export default useBottomHandleClick;
