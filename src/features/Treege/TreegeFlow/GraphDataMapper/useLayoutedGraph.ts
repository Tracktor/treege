// useLayoutedGraph.ts
import { Node, Edge, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

function toReactFlowNodes(minimalNodes: MinimalNode[]): Node<CustomNodeData>[] {
  return minimalNodes.map((m, index) => ({
    data: {
      ...m.data,
      order: index + 1,
    },
    height: 150,
    id: m.id,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    type: m.data.type ?? "text",
    width: 200,
  }));
}

function toReactFlowEdges(minimalEdges: MinimalEdge[]): Edge[] {
  return minimalEdges.map((m) => ({
    id: m.id,
    source: m.source,
    target: m.target,
    type: "orthogonal",
  }));
}

/**
 * Hook qui prend un MinimalGraph et renvoie nodes & edges ReactFlow layoutés
 */
const useLayoutedGraph = (graph: MinimalGraph) => {
  const [layoutedNodes, setLayoutedNodes] = useState<Node<CustomNodeData>[]>([]);
  const [layoutedEdges, setLayoutedEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph.nodes.length) {
      setLayoutedNodes([]);
      setLayoutedEdges([]);
      return;
    }

    const rfNodes = toReactFlowNodes(graph.nodes);
    const rfEdges = toReactFlowEdges(graph.edges);

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
