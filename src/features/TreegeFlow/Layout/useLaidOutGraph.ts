import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import expandTreeGraphWithChildren from "@/features/TreegeFlow/utils/expandMinimalGraphWithChildren";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/TreegeFlow/utils/toReactFlowConverter";
import { TreeNodeData, TreeGraph } from "@/features/TreegeFlow/utils/types";

type LayoutEngine = (nodes: Node<TreeNodeData>[], edges: Edge[]) => Promise<{ nodes: Node<TreeNodeData>[]; edges: Edge[] }>;

/**
 * Hook converting a TreeGraph to React Flow nodes & edges,
 * automatically expanding "children" into child nodes/edges,
 * and computing the layout via a layout engine (ELK or Dagre).
 */
const useLaidOutGraph = (graph: TreeGraph, layoutEngine: LayoutEngine) => {
  const [laidOutNodes, setLaidOutNodes] = useState<Node<TreeNodeData>[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph?.nodes?.length) {
      setLaidOutNodes([]);
      setLaidOutEdges([]);
      return;
    }

    // Expand "children" into real nodes & edges
    const expandedGraph = expandTreeGraphWithChildren(graph);

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
