import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import computeGraphLayout from "@/features/Treege/TreegeFlow/Layout/computeGraphLayout";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/utils/toReactFlowConverter";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

/**
 * Expand a MinimalGraph:
 * - Turns each node’s `children` into real option nodes and edges.
 */
const expandMinimalGraphWithChildren = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  graph.nodes.forEach((node) => {
    node.children?.forEach((child: Attributes, index: number) => {
      const childId = `${node.id}-child-${index}`;

      if (!graph.nodes.find((n) => n.id === childId) && !extraNodes.find((n) => n.id === childId)) {
        // Create the option node
        extraNodes.push({
          attributes: {
            ...child,
            type: child.type ?? "option",
          },
          children: [],
          id: childId,
        });

        // Create edge from parent to option node
        extraEdges.push({
          id: `edge-${node.id}-child-${index}`,
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

    // 1️⃣ Expand children → create child option nodes & edges
    const expandedGraph = expandMinimalGraphWithChildren(graph);

    // 2️⃣ Convert MinimalGraph → React Flow nodes & edges
    const reactFlowNodes = toReactFlowNodes(expandedGraph.nodes);
    const reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

    // 3️⃣ Compute layout with ELK
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
