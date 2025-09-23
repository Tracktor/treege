import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import computeGraphLayout from "@/features/Treege/TreegeFlow/Layout/computeGraphLayout";
import expandMinimalGraphWithChildren from "@/features/Treege/TreegeFlow/Layout/expandMinimalGraphWithChildren";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/utils/toReactFlowConverter";
import { CustomNodeData, MinimalGraph } from "@/features/Treege/TreegeFlow/utils/types";

/**
 * Hook converting a MinimalGraph to React Flow nodes & edges,
 * automatically expanding "children" into child nodes/edges,
 * and computing the layout via ELK.
 */
const useLaidOutGraph = (graph: MinimalGraph) => {
  const [laidOutNodes, setLaidOutNodes] = useState<Node<CustomNodeData>[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph?.nodes?.length) {
      setLaidOutNodes([]);
      setLaidOutEdges([]);
      return;
    }

    // Expand children → create child option nodes & edges
    const expandedGraph = expandMinimalGraphWithChildren(graph);

    // Convert MinimalGraph → React Flow nodes & edges
    const reactFlowNodes = toReactFlowNodes(expandedGraph.nodes);
    let reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

    reactFlowEdges = reactFlowEdges.map((e) => ({
      ...e,
      sourceHandle: `${e.source}-out`,
      targetHandle: `${e.target}-in`,
    }));

    // Compute layout with ELK
    (async () => {
      try {
        const { nodes, edges } = await computeGraphLayout(reactFlowNodes, reactFlowEdges);
        setLaidOutNodes(nodes);
        setLaidOutEdges(edges);
      } catch (err) {
        console.error("ELK layout error:", err);

        setLaidOutNodes(reactFlowNodes);
        setLaidOutEdges(reactFlowEdges);
      }
    })();
  }, [graph]);

  return { edges: laidOutEdges, nodes: laidOutNodes };
};

export default useLaidOutGraph;
