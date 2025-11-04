import { addEdge, Node, OnConnect, OnConnectEnd, OnEdgesDelete, useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { DEFAULT_NODE } from "@/editor/constants/defaultNode";
import { HORIZONTAL_NODE_OFFSET, VERTICAL_NODE_SPACING } from "@/editor/constants/nodeSpacing";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Custom hook to manage flow connections, including connecting nodes,
 * handling connection ends, and deleting edges with conditional logic.
 */
const useFlowConnections = () => {
  const { setNodes, setEdges, screenToFlowPosition, getNode, getNodes, getEdges } = useReactFlow();

  /**
   * Internal function to create a new node and connect it
   * Used by both onConnectEnd (drag) and onAddFromHandle (click "+")
   */
  const createNodeAndConnect = useCallback(
    (sourceNode: Node, position: { x: number; y: number }, shouldSelectNode = false) => {
      const sourceId = sourceNode.id;
      const edges = getEdges();
      const existingEdgesFromSource = edges.filter((edge) => edge.source === sourceId);
      const isSourceInputNode = isInputNode(sourceNode);

      // Block creation if source already has children and is NOT an input node
      if (existingEdgesFromSource.length > 0 && !isSourceInputNode) {
        return;
      }

      const nodeId = nanoid();

      const newNode: Node = {
        ...DEFAULT_NODE,
        id: nodeId,
        position,
        selected: true,
      };

      // If the source node is part of a group, set the new node to be part of the same group
      if (sourceNode?.parentId) {
        newNode.parentId = sourceNode.parentId;
        newNode.extent = "parent";
      }

      // Add the new node first
      setNodes((node) => node.concat(newNode));

      // Create a new edge with conditional logic if needed
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
          id: nanoid(),
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

      // Deselect all nodes and edges, then select the new node (only if requested)
      if (shouldSelectNode) {
        setNodes((nodes) => nodes.map((n) => ({ ...n, selected: n.id === nodeId })));
        setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })));
      }
    },
    [getEdges, setNodes, setEdges],
  );

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
   * Adds a new node below the source node and connects them
   * This is used when clicking the "+" handle button
   */
  const onAddFromHandle = useCallback(
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

      // Base position below the source node
      let newX = sourceNode.position.x;
      const newY = sourceNode.position.y + nodeHeight + VERTICAL_NODE_SPACING;

      // Check if there are already sibling nodes (same parent) to offset horizontally
      const allNodes = getNodes();
      const allEdges = getEdges();

      // Find existing siblings (nodes that share the same parent/source)
      const existingSiblings = allNodes.filter((node) =>
        allEdges.some((edge) => edge.source === sourceNodeId && edge.target === node.id)
      );

      // If there are existing siblings, place the new node to the right of the rightmost one
      if (existingSiblings.length > 0) {
        const rightmostSibling = existingSiblings.reduce(
          (max, node) => (node.position.x > max.position.x ? node : max),
          existingSiblings[0]
        );
        newX = rightmostSibling.position.x + nodeWidth + HORIZONTAL_NODE_OFFSET;
      }

      // Use the shared function to create node and connect, with selection enabled
      createNodeAndConnect(sourceNode, { x: newX, y: newY }, true);
    },
    [getNode, getNodes, getEdges, createNodeAndConnect],
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

        // Convert screen coordinates to flow position
        const position = screenToFlowPosition({ x: clientX, y: clientY });

        // Use the shared function to create node and connect
        createNodeAndConnect(sourceNode, position);
      }
    },
    [createNodeAndConnect, screenToFlowPosition],
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
              // Remove conditions and isFallback, preserve other custom data
              const { conditions: _dropConditions, isFallback: _dropFallback, ...rest } = edge.data ?? {};
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
      // Prevent self-loops
      if (connection.source === connection.target) {
        return false;
      }

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
    onAddFromHandle,
    onConnect,
    onConnectEnd,
    onEdgesDelete,
  };
};

export default useFlowConnections;
