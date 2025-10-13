import { useEdges } from "@xyflow/react";
import { useMemo } from "react";

/**
 * Hook to access flow edges selection state and derived data.
 * Only re-renders when selection or edges change.
 */
const useEdgesSelection = () => {
  const edges = useEdges();
  const selectedEdges = useMemo(() => edges.filter((edge) => edge.selected), [edges]);
  const selectedEdge = useMemo(() => edges.find((edge) => edge.selected), [edges]);

  return {
    edges,
    hasSelectedEdges: selectedEdges.length > 0,
    selectedEdge,
    selectedEdges,
  };
};

export default useEdgesSelection;
