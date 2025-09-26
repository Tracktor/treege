import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import expandMinimalGraphWithChildren from "@/features/Treege/TreegeFlow/utils/expandMinimalGraphWithChildren";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/utils/toReactFlowConverter";
import { CustomNodeData, MinimalGraph } from "@/features/Treege/TreegeFlow/utils/types";

type LayoutEngine = (nodes: Node<CustomNodeData>[], edges: Edge[]) => Promise<{ nodes: Node<CustomNodeData>[]; edges: Edge[] }>;

/**
 * Hook converting a MinimalGraph to React Flow nodes & edges,
 * automatically expanding "children" into child nodes/edges,
 * and computing the layout via a layout engine (ELK or Dagre).
 */
const useLaidOutGraph = (graph: MinimalGraph, layoutEngine: LayoutEngine) => {
  const [laidOutNodes, setLaidOutNodes] = useState<Node<CustomNodeData>[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph?.nodes?.length) {
      setLaidOutNodes([]);
      setLaidOutEdges([]);
      return;
    }

    const expandedGraph = expandMinimalGraphWithChildren(graph);
    const reactFlowNodes = toReactFlowNodes(expandedGraph.nodes);
    const reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

    (async () => {
      try {
        const { nodes, edges } = await layoutEngine(reactFlowNodes, reactFlowEdges);
        setLaidOutNodes(nodes);
        setLaidOutEdges(edges);
      } catch (err) {
        console.error(err);
        setLaidOutNodes(reactFlowNodes);
        setLaidOutEdges(reactFlowEdges);
      }
    })();
  }, [graph, layoutEngine]);

  return { edges: laidOutEdges, nodes: laidOutNodes };
};

export default useLaidOutGraph;
