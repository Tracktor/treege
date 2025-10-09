import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

/**
 * Custom hook providing various actions to manipulate nodes and edges
 * within a React Flow instance.
 */
const useFlowActions = () => {
  const { setNodes, setEdges, getNodes } = useReactFlow();

  /**
   * Clears the selection of all nodes and edges in the flow.
   */
  const clearSelection = useCallback(() => {
    setNodes((nds) => nds.map(({ selected, ...node }) => node));
    setEdges((eds) => eds.map(({ selected, ...edge }) => edge));
  }, [setEdges, setNodes]);

  /**
   * Updates a node's data by its ID.
   * @param id - The ID of the node to update.
   * @param data - Partial data to merge into the node's existing data.
   */
  const updateNodeData = useCallback(
    <T extends Record<string, any>>(id: string, data: Partial<T>) => {
      setNodes((nds) =>
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
    [setNodes],
  );

  /**
   * Updates a node's type by its ID.
   * @param id - The ID of the node to update.
   * @param type - The new type to set for the node.
   */
  const updateNodeType = useCallback(
    (id: string, type: string) => {
      setNodes((nds) =>
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
    [setNodes],
  );

  /**
   * Updates the type of the currently selected node.
   * If no node is selected, the function does nothing.
   * @param type - The new type to set for the selected node.
   */
  const updateSelectedNodeType = useCallback(
    (type: string) => {
      const currentSelectedNode = getNodes().find((node) => node.selected);
      if (!currentSelectedNode) return;

      updateNodeType(currentSelectedNode.id, type);
    },
    [getNodes, updateNodeType],
  );

  /**
   * Updates the data of the currently selected node.
   * If no node is selected, the function does nothing.
   * @param data - Partial data to merge into the selected node's existing data.
   */
  const updateSelectedNodeData = useCallback(
    <T extends Record<string, any>>(data: Partial<T>) => {
      const currentSelectedNode = getNodes().find((node) => node.selected);
      if (!currentSelectedNode) return;

      updateNodeData(currentSelectedNode.id, data);
    },
    [getNodes, updateNodeData],
  );

  return {
    clearSelection,
    updateNodeData,
    updateNodeType,
    updateSelectedNodeData,
    updateSelectedNodeType,
  };
};

export default useFlowActions;
