import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/TreegeFlow";

export type ElkLayoutOptions = Partial<{
  "elk.algorithm": "layered" | "force" | "mrtree";
  "elk.direction": "DOWN" | "RIGHT" | "UP" | "LEFT";
  "elk.edgeRouting": "ORTHOGONAL" | "POLYLINE" | "SPLINES";
  "elk.layered.spacing.nodeNodeBetweenLayers": string;
  "elk.padding": string;
  "elk.spacing.edgeNode": string;
  "elk.spacing.nodeNode": string;
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
  "elk.layered.spacing.nodeNodeBetweenLayers": "120",
  "elk.padding": "[top=50,left=50,bottom=50,right=50]",
  "elk.spacing.edgeNode": "40",
  "elk.spacing.nodeNode": "80",
};

export const getLayoutedElements = async (
  nodes: Node<CustomNodeData>[],
  edges: Edge[],
  options: ElkLayoutOptions = {},
): Promise<{
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
}> => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";

  // Mapper les edges React Flow en edges ELK
  const elkEdges: ElkEdge[] = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const graph = {
    children: nodes.map((node) => ({
      ...node,
      height: 150,
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

    const layoutedEdges: Edge[] = layoutedGraph.edges.map((e) => ({
      id: e.id,
      source: e.sources[0],
      target: e.targets[0],
    }));

    const newLayoutedNodes: Node<CustomNodeData>[] = (layoutedGraph.children ?? [])
      .filter((node) => node.x !== undefined && node.y !== undefined)
      .map((node) => ({
        ...node,
        height: 150,
        position: { x: node.x ?? 0, y: node.y ?? 0 },
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        width: 200,
      }));

    return { edges: layoutedEdges, nodes: newLayoutedNodes };
  } catch (error) {
    console.error("ELK Layout error:", error);
    throw error;
  }
};

export default getLayoutedElements;
