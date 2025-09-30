import { addEdge, Node, useReactFlow } from "@xyflow/react";
import type { OnConnect, OnConnectEnd } from "@xyflow/system";
import { nanoid } from "nanoid";
import { useCallback } from "react";

/**
 * A custom hook to manage interactions within a React Flow instance.
 * It provides handlers for connecting nodes, ending connections,
 * and starting node drag events.
 */
const useFlowInteractions = () => {
  const { setNodes, setEdges, screenToFlowPosition } = useReactFlow();

  /**
   * Handles the connection of two nodes in the flow.
   * This function is called when a connection is made between two nodes.
   * It updates the edges state by adding the new edge to the existing edges.
   *
   * @param params - The parameters of the connection, including source and target node IDs.
   */
  const onConnect: OnConnect = useCallback((params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), [setEdges]);

  /**
   * Handles the end of a connection attempt in the flow.
   * If the connection is not valid (i.e., not dropped on another node),
   * this function creates a new node at the drop position and connects it
   */
  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      // Create a new node when dropped on the blank area
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = nanoid();
        const { clientX, clientY } = "changedTouches" in event ? event.changedTouches[0] : event;

        const newNode: Node = {
          data: { label: "" },
          id,
          origin: [0.5, 0.0],
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          type: "default",
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id, source: connectionState.fromNode?.id || "", target: id }));
      }
    },
    [screenToFlowPosition, setEdges, setNodes],
  );

  /**
   * Handles the start of a node drag event.
   * This function is called when a user starts dragging a node.
   * It unselects all nodes to prevent the action of opening a sheet or other side effects.
   */
  const onNodeDragStart = useCallback(() => {
    // Unselect all nodes when starting to drag a node to avoid sheet opening
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: false,
      })),
    );
  }, [setNodes]);

  return {
    onConnect,
    onConnectEnd,
    onNodeDragStart,
  };
};

export default useFlowInteractions;
