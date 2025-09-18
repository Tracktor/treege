import { Node, Edge, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import getLayout from "@/features/Treege/getLayout/getLayout";
import { MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

/** Convertit MinimalNode → Node ReactFlow */
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

/** Convertit MinimalEdge → Edge ReactFlow */
function toReactFlowEdges(minimalEdges: MinimalEdge[]): Edge[] {
  return minimalEdges.map((m) => ({
    id: m.id,
    source: m.source,
    target: m.target,
    type: "orthogonal",
  }));
}

/**
 * Génère automatiquement des nœuds enfants + edges pour les attributes
 * sans modifier le graphe minimal d’origine
 */
function expandNodesWithAttributes(graph: MinimalGraph): MinimalGraph {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  graph.nodes.forEach((node) => {
    node.data.attributes?.forEach((attr, index) => {
      const childId = `${node.id}-attr-${index}`;
      if (!graph.nodes.find((n) => n.id === childId) && !extraNodes.find((n) => n.id === childId)) {
        extraNodes.push({
          data: {
            attributes: [],
            name: `${attr.key}: ${attr.value}`,
            type: "option",
          },
          id: childId,
        });
        extraEdges.push({
          id: `edge-${node.id}-attr-${index}`,
          source: node.id,
          target: childId,
        });
      }
    });
  });

  return {
    edges: [...graph.edges, ...extraEdges],
    nodes: [...graph.nodes, ...extraNodes],
  };
}

/**
 * Hook that takes a minimal graph and returns nodes and edges with an ELK layout
 * with expanded attribute nodes.
 */
const useLayoutedGraph = (graph: MinimalGraph) => {
  const [layoutedNodes, setLayoutedNodes] = useState<Node<CustomNodeData>[]>([]);
  const [layoutedEdges, setLayoutedEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph || !graph.nodes || graph.nodes.length === 0) {
      setLayoutedNodes([]);
      setLayoutedEdges([]);
      return;
    }

    const expandedGraph = expandNodesWithAttributes(graph);

    const rfNodes = toReactFlowNodes(expandedGraph.nodes);
    const rfEdges = toReactFlowEdges(expandedGraph.edges);

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
