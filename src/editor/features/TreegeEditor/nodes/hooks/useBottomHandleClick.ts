import { MouseEvent, useCallback } from "react";
import useFlowConnections from "@/editor/hooks/useFlowConnections";

/**
 * Custom hook to handle clicks on bottom handles of nodes
 * @param nodeId - The ID of the current node
 * @returns Click handler for the bottom handle
 */
const useBottomHandleClick = (nodeId: string) => {
  const { onAddFromHandle } = useFlowConnections();

  return useCallback(
    (event: MouseEvent) => {
      // Only trigger on direct click, not on drag
      if (event.defaultPrevented) {
        return;
      }
      onAddFromHandle(nodeId);
    },
    [onAddFromHandle, nodeId],
  );
};

export default useBottomHandleClick;
