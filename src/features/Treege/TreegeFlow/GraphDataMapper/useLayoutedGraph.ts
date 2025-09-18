import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { MinimalGraph } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import expandMinimalGraphWithOptions from "@/features/Treege/TreegeFlow/GraphDataMapper/expandMinimalGraphWithOptions";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/GraphDataMapper/MinimaltoReactFlowNodesConverter";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const useLayoutedGraph = (graph: MinimalGraph) => {
  const [layoutedNodes, setLayoutedNodes] = useState<Node<CustomNodeData>[]>([]);
  const [layoutedEdges, setLayoutedEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph || !graph.nodes || graph.nodes.length === 0) {
      setLayoutedNodes([]);
      setLayoutedEdges([]);
      return;
    }

    // Expansion auto des options
    const expanded = expandMinimalGraphWithOptions(graph);

    const rfNodes = toReactFlowNodes(expanded.nodes);
    const rfEdges = toReactFlowEdges(expanded.edges);

    (async () => {
      try {
        const { nodes, edges } = await getLayout(rfNodes, rfEdges);
        setLayoutedNodes(nodes);
        setLayoutedEdges(edges);
      } catch (err) {
        console.error("ELK layout error:", err);
      }
    })();
  }, [graph]);

  return { edges: layoutedEdges, nodes: layoutedNodes };
};

export default useLayoutedGraph;
