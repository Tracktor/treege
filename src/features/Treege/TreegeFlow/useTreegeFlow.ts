import { useReactFlow } from "@xyflow/react";
import { useEffect, useRef } from "react";
import reactFlowToMinimal from "@/features/Treege/TreegeFlow/utils/toMinimalConverter";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

const useTreegeFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, graph, onConnect, setGraph } = useTreegeFlowContext();
  const minimalGraph = reactFlowToMinimal(nodes, edges);
  const isGraphEmpty = !graph || graph.nodes.length === 0;
  const { fitView } = useReactFlow();
  const didFitView = useRef(false);

  const handleViewerChange = (value: string) => {
    const parsed = JSON.parse(value);
    didFitView.current = false;

    setGraph(parsed);
  };

  // Auto-fit view whenever nodes or edges change
  useEffect(() => {
    if (!didFitView.current && nodes.length > 0) {
      fitView({
        duration: 300,
        includeHiddenNodes: false,
        padding: 0.2,
      }).then();
      didFitView.current = true;
    }
  }, [nodes.length, fitView]);

  return { edges, graph, handleViewerChange, isGraphEmpty, minimalGraph, nodes, onConnect, onEdgesChange, onNodesChange };
};

export default useTreegeFlow;
