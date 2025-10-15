import { addEdge, Node, useReactFlow } from "@xyflow/react";
import type { OnEdgesDelete } from "@xyflow/react/dist/esm/types";
import type { OnConnect, OnConnectEnd } from "@xyflow/system";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { defaultNode } from "@/editor/constants/defaultNode";

/**
 * Custom hook to manage flow connections, including connecting nodes,
 * handling connection ends, and deleting edges with conditional logic.
 */
const useFlowConnections = () => {
  const { setNodes, setEdges, screenToFlowPosition } = useReactFlow();

  /**
   * Handles the connection of two nodes in the flow.
   */
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => {
        const newEdges = addEdge(params, edgesSnapshot);
        const sourceId = params.source;
        const childrenEdges = newEdges.filter((edge) => edge.source === sourceId);

        // If parent has more than one child, set all its edges to be "conditional"
        if (childrenEdges.length > 1) {
          return newEdges.map((edge) => {
            if (edge.source === sourceId) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  conditions: edge.data?.conditions || [{ field: sourceId, operator: "===", value: "" }],
                },
                type: "conditional",
              };
            }
            return edge;
          });
        }

        return newEdges;
      });
    },
    [setEdges],
  );

  /**
   * Handles the end of a connection attempt in the flow.
   */
  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } = "changedTouches" in event ? event.changedTouches[0] : event;
        const nodeId = nanoid();
        const edgeId = nanoid();
        const sourceNode = connectionState.fromNode;
        const sourceId = connectionState.fromNode?.id || "";

        const newNode: Node = {
          ...defaultNode,
          id: nodeId,
          origin: [0.5, 0.0],
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
        };

        // If the source node is part of a group, set the new node to be part of the same group
        if (sourceNode?.parentId) {
          newNode.parentId = sourceNode.parentId;
          newNode.extent = "parent";
        }

        setNodes((node) => node.concat(newNode));

        // Create a new edge from the source node to the newly created node
        setEdges((edges) => {
          const childrenEdges = edges.filter((edge) => edge.source === sourceId);
          const willHaveSiblings = childrenEdges.length > 0;

          const newEdge = {
            data: willHaveSiblings
              ? {
                  conditions: [{ field: sourceId, operator: "===", value: "" }],
                }
              : undefined,
            id: edgeId,
            source: sourceId,
            target: nodeId,
            type: willHaveSiblings ? "conditional" : "default",
          };

          // If the source node will have siblings, update all its edges to be "conditional"
          if (willHaveSiblings) {
            return edges
              .map((edge) => {
                if (edge.source === sourceId) {
                  return {
                    ...edge,
                    data: {
                      ...edge.data,
                      conditions: edge.data?.conditions || [{ field: sourceId, operator: "===", value: "" }],
                    },
                    type: "conditional",
                  };
                }
                return edge;
              })
              .concat(newEdge);
          }

          return edges.concat(newEdge);
        });
      }
    },
    [screenToFlowPosition, setEdges, setNodes],
  );

  /**
   * Handles the deletion of edges in the flow.
   */
  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deletedEdges) => {
      setEdges((edges) => {
        const remainingEdges = edges.filter((edge) => !deletedEdges.find((deleted) => deleted.id === edge.id));

        // For each parent of the deleted edges, check if they have only one child left
        const affectedParents = new Set(deletedEdges.map((edge) => edge.source));

        return remainingEdges.map((edge) => {
          if (affectedParents.has(edge.source)) {
            const siblingCount = remainingEdges.filter((e) => e.source === edge.source).length;

            // If only one child left, set the edge to be "default"
            if (siblingCount === 1) {
              return {
                ...edge,
                data: undefined,
                type: "default",
              };
            }
          }
          return edge;
        });
      });
    },
    [setEdges],
  );

  return {
    onConnect,
    onConnectEnd,
    onEdgesDelete,
  };
};

export default useFlowConnections;
