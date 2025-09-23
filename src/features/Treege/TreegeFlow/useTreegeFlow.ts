import { useReactFlow } from "@xyflow/react";
import { useEffect, useRef } from "react";
import reactFlowToMinimal from "@/features/Treege/TreegeFlow/utils/toMinimalConverter";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

const useTreegeFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, graph, onConnect } = useTreegeFlowContext();
  const minimalGraph = reactFlowToMinimal(nodes, edges);
  const isGraphEmpty = !graph || graph.nodes.length === 0;

  const { fitView } = useReactFlow();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-fit view whenever nodes or edges change
  useEffect(() => {
    // Clear any pending fitView calls before scheduling a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only run fitView if we actually have nodes
    if (nodes.length > 0) {
      timeoutRef.current = setTimeout(async () => {
        try {
          await fitView({
            duration: 300,
            includeHiddenNodes: true,
            padding: 0.2,
          });
        } catch (e) {
          console.error(e);
        }
      }, 100);
    }

    // Cleanup: always clear the timeout when dependencies change or on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [nodes, edges, fitView]);

  return { edges, graph, isGraphEmpty, minimalGraph, nodes, onConnect, onEdgesChange, onNodesChange };
};

export default useTreegeFlow;
