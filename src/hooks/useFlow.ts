import { Node, useReactFlow, useStore } from "@xyflow/react";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";

/**
 * A custom hook to access and manage the state of a React Flow instance.
 * It provides access to nodes, edges, and selected elements, along with
 * various utility functions from the React Flow context.
 */
const useFlow = () => {
  const reactFlow = useReactFlow();
  const groupNodes = useStore((state) => state.nodes.filter((node) => node.type === "group"), shallow);

  const { selectedEdges, selectedNodes, selectedEdge, selectedNode } = useStore(
    (state) => ({
      selectedEdge: state.edges.find((edge) => edge.selected),
      selectedEdges: state.edges.filter((edge) => edge.selected),
      selectedNode: state.nodes.find((node) => node.selected),
      selectedNodes: state.nodes.filter((node) => node.selected),
    }),
    shallow,
  );

  const clearSelection = useCallback(() => {
    reactFlow.setNodes((nds) => nds.map(({ selected, ...node }) => node));
    reactFlow.setEdges((eds) => eds.map(({ selected, ...edge }) => edge));
  }, [reactFlow]);

  /**
   * Updates a node's data by its ID.
   * @param id - The ID of the node to update.
   * @param data - Partial data to merge into the node's existing data.
   */
  const updateNodeData = useCallback(
    (id: string, data: Partial<Node[][number]["data"]>) => {
      reactFlow.setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            };
          }
          return node;
        }),
      );
    },
    [reactFlow],
  );

  /**
   * Updates a node's type by its ID.
   * @param id - The ID of the node to update.
   * @param type - The new type to set for the node.
   */
  const updateNodeType = useCallback(
    (id: string, type: string) => {
      reactFlow.setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {},
              type,
            };
          }
          return node;
        }),
      );
    },
    [reactFlow],
  );

  /**
   * Updates the type of the currently selected node.
   * If no node is selected, the function does nothing.
   * @param type - The new type to set for the selected node.
   */
  const updateSelectedNodeType = useCallback(
    (type: string) => {
      const currentSelectedNode = reactFlow.getNodes().find((node) => node.selected);
      if (!currentSelectedNode) return;

      updateNodeType(currentSelectedNode.id, type);
    },
    [reactFlow, updateNodeType],
  );

  /**
   * Updates the data of the currently selected node.
   * If no node is selected, the function does nothing.
   * @param data - Partial data to merge into the selected node's existing data.
   */
  const updateSelectedNodeData = useCallback(
    (data: Partial<Node[][number]["data"]>) => {
      const currentSelectedNode = reactFlow.getNodes().find((node) => node.selected);
      if (!currentSelectedNode) return;

      updateNodeData(currentSelectedNode.id, data);
    },
    [reactFlow, updateNodeData],
  );

  return {
    ...reactFlow,
    clearSelection,
    groupNodes,
    hasSelectedEdges: selectedEdges.length > 0,
    hasSelectedNodes: selectedNodes.length > 0,
    selectedEdge,
    selectedEdges,
    selectedNode,
    selectedNodes,
    updateNodeData,
    updateNodeType,
    updateSelectedNodeData,
    updateSelectedNodeType,
  };
};

export default useFlow;
