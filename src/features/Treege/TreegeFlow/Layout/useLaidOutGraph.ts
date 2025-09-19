import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import { MinimalGraph } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import expandMinimalGraphWithOptions from "@/features/Treege/TreegeFlow/GraphDataMapper/expandMinimalGraphWithOptions";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/GraphDataMapper/MinimaltoReactFlowNodesConverter";
import computeGraphLayout from "@/features/Treege/TreegeFlow/Layout/computeGraphLayout";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

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

    // 1️⃣ Expand options → create child option nodes & edges
    const expandedGraph = expandMinimalGraphWithOptions(graph);

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
