import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import expandTreeGraphWithChildren from "@/features/TreegeFlow/utils/expandTreeGraphWithChildren";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/TreegeFlow/utils/toReactFlowConverter";
import { TreeNodeData, TreeGraph, Orientation } from "@/features/TreegeFlow/utils/types";

type LayoutEngine = (
  nodes: Node<TreeNodeData>[],
  edges: Edge[],
  direction: Orientation,
) => Promise<{ nodes: Node<TreeNodeData>[]; edges: Edge[] }>;

/**
 * Hook converting a TreeGraph to React Flow nodes & edges,
 * automatically expanding "children" into child nodes/edges,
 * and computing the layout via a layout engine (ELK or Dagre).
 */
const useLaidOutGraph = (graph: TreeGraph, layoutEngine: LayoutEngine, orientation: Orientation = "vertical") => {
  const [laidOutNodes, setLaidOutNodes] = useState<Node<TreeNodeData>[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Handle empty graph case (immediately clear nodes & edges)
    if (!graph?.nodes?.length) {
      setLaidOutNodes([]);
      setLaidOutEdges([]);
      return;
    }

    // Expand "children" into real nodes & edges
    const expandedGraph = expandTreeGraphWithChildren(graph);
    const reactFlowNodes = toReactFlowNodes(expandedGraph.nodes);
    const reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

    // Compute layout with the provided layout engine
    (async () => {
      // Layout engine might throw (e.g. ELK on large graphs), so we catch errors here
      // and fallback to unlaid-out nodes & edges
      try {
        const { nodes, edges } = await layoutEngine(reactFlowNodes, reactFlowEdges, orientation);
        // Update state with laid-out nodes & edges
        setLaidOutNodes(nodes);
        setLaidOutEdges(edges);
      } catch (err) {
        console.error(err);
        // Fallback to unlaid-out nodes & edges
        setLaidOutNodes(reactFlowNodes);
        setLaidOutEdges(reactFlowEdges);
      }
    })();
  }, [graph, layoutEngine, orientation]);

  return { edges: laidOutEdges, nodes: laidOutNodes };
};

export default useLaidOutGraph;
