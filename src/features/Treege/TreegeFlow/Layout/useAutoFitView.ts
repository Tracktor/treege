import { useReactFlow, Node, Edge } from "@xyflow/react";
import { useEffect, useRef } from "react";

/**
 * useAutoFitView
 *
 * A custom hook that automatically calls React Flow's `fitView` whenever
 * the nodes or edges change. This ensures the viewport always adjusts to show
 * all nodes, which is especially useful when dynamically adding or removing nodes.
 *
 * @param nodes - The current array of React Flow nodes.
 * @param edges - The current array of React Flow edges.
 * @param delay - Optional debounce delay (ms) before fitting view. Default: 100ms.
 * @param duration - Optional animation duration (ms) for the fitView call. Default: 300ms.
 *
 * Example:
 * ```tsx
 * const { nodes, edges } = useTreegeFlowContext();
 * useAutoFitView(nodes, edges);
 * ```
 *
 * This will automatically fit the view whenever nodes or edges change.
 */
const useAutoFitView = (nodes: Node[], edges: Edge[], delay = 100, duration = 300): void => {
  const { fitView } = useReactFlow();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending fitView calls before scheduling a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only run fitView if we actually have nodes
    if (nodes.length > 0) {
      // Debounce + animate the fitView
      timeoutRef.current = setTimeout(async () => {
        try {
          // Fit view to all visible nodes/edges with animation
          await fitView({
            duration,
            includeHiddenNodes: true,
            padding: 0.2,
          });
        } catch (e) {
          // Catch errors in case fitView fails
          console.error(e);
        }
      }, delay);
    }

    // Cleanup: always clear the timeout when dependencies change or on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [nodes, edges, fitView, delay, duration]);
};

export default useAutoFitView;
