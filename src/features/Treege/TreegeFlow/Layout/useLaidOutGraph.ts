import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import computeGraphLayout from "@/features/Treege/TreegeFlow/Layout/computeGraphLayout";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/utils/toReactFlowNodesConverter";
import { CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode, NodeOptions } from "@/features/Treege/TreegeFlow/utils/types";

const expandMinimalGraphWithOptions = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  graph.nodes.forEach((node) => {
    node.options?.forEach((opt: NodeOptions, index: number) => {
      const childId = `${node.id}-option-${index}`;

      if (!graph.nodes.find((n) => n.id === childId) && !extraNodes.find((n) => n.id === childId)) {
        extraNodes.push({
          attributes: {
            ...opt,
            type: opt.type ?? "option",
          },
          id: childId,
          options: [],
        });

        extraEdges.push({
          id: `edge-${node.id}-option-${index}`,
          source: node.id,
          target: childId,
          type: "option",
        });
      }
    });
  });

  return {
    edges: [...graph.edges, ...extraEdges],
    nodes: [...graph.nodes, ...extraNodes],
  };
};

/**
 * Hook converting a MinimalGraph to React Flow nodes & edges,
 * automatically expanding "options" into child nodes/edges,
 * and computing the layout via ELK.
 */
const useLaidOutGraph = (graph: MinimalGraph) => {
  const [laidOutNodes, setLaidOutNodes] = useState<Node<CustomNodeData>[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<Edge[]>([]);

  // Recompute laidOutNodes & laidOutEdges whenever the input graph changes
  useEffect(() => {
    if (!graph?.nodes?.length) {
      setLaidOutNodes([]);
      setLaidOutEdges([]);
      return;
    }

    // Expand options → create child option nodes & edges
    const expandedGraph = expandMinimalGraphWithOptions(graph);

    // Convert MinimalGraph → React Flow nodes & edges
    const reactFlowNodes = toReactFlowNodes(expandedGraph.nodes);
    const reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

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
