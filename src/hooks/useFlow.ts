import { useReactFlow, useStore } from "@xyflow/react";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";

/**
 * A custom hook to access and manage the state of a React Flow instance.
 * It provides access to nodes, edges, and selected elements, along with
 * various utility functions from the React Flow context.
 */
const useFlow = () => {
  const reactFlow = useReactFlow();

  const { nodes, edges, selectedNodes, selectedEdges } = useStore(
    (state) => ({
      edges: state.edges,
      nodes: state.nodes,
      selectedEdges: state.edges.filter((e) => e.selected),
      selectedNodes: state.nodes.filter((n) => n.selected),
    }),
    shallow,
  );

  /**
   * Clears the selection of all nodes and edges in the React Flow instance.
   */
  const clearSelection = useCallback(() => {
    const updatedNodes = nodes.map(({ selected, ...node }) => node);
    const updatedEdges = edges.map(({ selected, ...edge }) => edge);

    reactFlow.setNodes(updatedNodes);
    reactFlow.setEdges(updatedEdges);
  }, [nodes, edges, reactFlow]);

  return {
    ...reactFlow,
    clearSelection,
    edges,
    hasSelectedEdges: selectedEdges.length > 0,
    hasSelectedNode: selectedNodes.length > 0,
    nodes,
    selectedEdges,
    selectedNodes,
  };
};

export default useFlow;
