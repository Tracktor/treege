import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export type ElkLayoutOptions = Partial<{
  "elk.algorithm": "layered" | "force" | "mrtree";
  "elk.direction": "DOWN" | "RIGHT" | "UP" | "LEFT";
  "elk.edgeRouting": "ORTHOGONAL" | "POLYLINE" | "SPLINES";
  "elk.layered.spacing.nodeNodeBetweenLayers": string;
  "elk.padding": string;
  "elk.spacing.edgeNode": string;
  "elk.spacing.nodeNode": string;
  "elk.layered.nodePlacement.strategy": string;
  "elk.layered.nodeOrder.strategy": string;
}>;

type ElkEdge = {
  id: string;
  sources: string[];
  targets: string[];
};

const elk = new ELK();

const elkOptions: ElkLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.nodeOrder.strategy": "NETWORK_SIMPLEX",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "elk.layered.spacing.nodeNodeBetweenLayers": "150",
  "elk.padding": "[top=50,left=50,bottom=50,right=50]",
  "elk.spacing.edgeNode": "60",
  "elk.spacing.nodeNode": "150",
};

export const getLayout = async (
  nodes: Node<CustomNodeData>[],
  edges: Edge[],
  options: ElkLayoutOptions = {},
): Promise<{
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
}> => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";

  const nodeIds = new Set(nodes.map((n) => n.id));
  const elkEdges: ElkEdge[] = edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

  // Sort by order in data before sending to ELK
  const sortedNodes = [...nodes].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

  const graph = {
    children: sortedNodes.map((node) => ({
      ...node,
      height: 150,
      order: node.data.order ?? 0,
      sourcePosition: isHorizontal ? "right" : "bottom",
      targetPosition: isHorizontal ? "left" : "top",
      width: 200,
    })),
    edges: elkEdges,
    id: "root",
    layoutOptions: { ...elkOptions, ...options },
  };

  try {
    const layoutedGraph = await elk.layout(graph);

    const elkEdgeMap = new Map((layoutedGraph.edges ?? []).map((e) => [e.id, e]));

    const layoutedEdges: Edge[] = edges.map((original) => {
      const elkEdge = elkEdgeMap.get(original.id);
      if (elkEdge) {
        return {
          ...original,
          source: elkEdge.sources[0],
          target: elkEdge.targets[0],
          type: "straight",
        };
      }
      return {
        ...original,
        type: "straight",
      };
    });

    const newLayoutNodes: Node<CustomNodeData>[] = (layoutedGraph.children ?? [])
      .filter((node) => node.x !== undefined && node.y !== undefined)
      .map((node) => ({
        ...node,
        height: 150,
        position: { x: node.x ?? 0, y: node.y ?? 0 },
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        width: 200,
      }));

    return { edges: layoutedEdges, nodes: newLayoutNodes };
  } catch (error) {
    console.error("ELK Layout error:", error);
    throw error;
  }
};

export default getLayout;
