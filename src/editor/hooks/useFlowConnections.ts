import { addEdge, Node, OnConnect, OnConnectEnd, OnEdgesDelete, useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { defaultNode } from "@/editor/constants/defaultNode";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Custom hook to manage flow connections, including connecting nodes,
 * handling connection ends, and deleting edges with conditional logic.
 */
const useFlowConnections = () => {
  const { setNodes, setEdges, screenToFlowPosition, getNode, getEdges } = useReactFlow();

  /**
   * Handles the connection of two nodes in the flow.
   */
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => {
        const newEdges = addEdge(params, edgesSnapshot);
        const sourceId = params.source;
        const sourceNode = getNode(sourceId);
        const childrenEdges = newEdges.filter((edge) => edge.source === sourceId);

        // If parent has more than one child, set all its edges to be "conditional"
        // Only create conditional edges if the source node is an input node
        if (childrenEdges.length > 1 && sourceNode && isInputNode(sourceNode)) {
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
    [setEdges, getNode],
  );

  /**
   * Handles the end of a connection attempt in the flow.
   */
  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } = "changedTouches" in event ? event.changedTouches[0] : event;
        const sourceNode = connectionState.fromNode;

        if (!sourceNode) {
          return; // no valid start node, abort
        }

        const sourceId = sourceNode.id;
        const edges = getEdges();
        const existingEdgesFromSource = edges.filter((edge) => edge.source === sourceId);
        const isSourceInputNode = sourceNode && isInputNode(sourceNode);

        // Block creation if source already has children and is NOT an input node
        if (existingEdgesFromSource.length > 0 && !isSourceInputNode) {
          return;
        }

        const nodeId = nanoid();
        const edgeId = nanoid();

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
        setEdges((edgesSnapshot) => {
          const childrenEdges = edgesSnapshot.filter((edge) => edge.source === sourceId);
          const willHaveSiblings = childrenEdges.length > 0;

          const newEdge = {
            data:
              willHaveSiblings && isSourceInputNode
                ? {
                    conditions: [{ field: sourceId, operator: "===", value: "" }],
                  }
                : undefined,
            id: edgeId,
            source: sourceId,
            target: nodeId,
            type: willHaveSiblings && isSourceInputNode ? "conditional" : "default",
          };

          // If the source node will have siblings and is an input node, update all its edges to be "conditional"
          if (willHaveSiblings && isSourceInputNode) {
            return edgesSnapshot
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

          return edgesSnapshot.concat(newEdge);
        });
      }
    },
    [screenToFlowPosition, setEdges, setNodes, getEdges],
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

        // Precompute remaining child counts per parent (avoids E² complexity)
        const childCount = new Map<string, number>();
        remainingEdges.forEach((e) => {
          childCount.set(e.source, (childCount.get(e.source) ?? 0) + 1);
        });

        return remainingEdges.map((edge) => {
          if (affectedParents.has(edge.source)) {
            const siblingCount = childCount.get(edge.source) ?? 0;

            // If only one child left, set the edge to be "default"
            if (siblingCount === 1) {
              // Only remove conditions, preserve other custom data
              const { ...rest } = edge.data ?? {};
              const cleaned = rest && Object.keys(rest).length > 0 ? rest : undefined;
              return { ...edge, data: cleaned, type: "default" };
            }
          }
          return edge;
        });
      });
    },
    [setEdges],
  );

  /**
   * Validates if a connection can be created between two nodes.
   * Prevents multiple edges from non-input nodes (only input nodes can have conditional edges).
   */
  const isValidConnection = useCallback(
    (connection: { source: string; target: string }) => {
      const sourceNode = getNode(connection.source);

      if (!sourceNode) {
        return false;
      }

      const edges = getEdges();
      const existingEdgesFromSource = edges.filter((edge) => edge.source === connection.source);

      // If source already has at least one edge and is NOT an input node, block the connection
      return !(existingEdgesFromSource.length > 0 && !isInputNode(sourceNode));
    },
    [getNode, getEdges],
  );

  return {
    isValidConnection,
    onConnect,
    onConnectEnd,
    onEdgesDelete,
  };
};

export default useFlowConnections;
