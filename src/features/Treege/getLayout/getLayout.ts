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

  // ⚡ garder uniquement les edges valides
  const elkEdges: ElkEdge[] = edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
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

    // ⚡ Indexer les edges renvoyés par ELK
    const elkEdgeMap = new Map((layoutedGraph.edges ?? []).map((e) => [e.id, e]));

    // ⚡ Reconstruire tous les edges à partir de la liste originale
    const layoutedEdges: Edge[] = edges.map((original) => {
      const elkEdge = elkEdgeMap.get(original.id);
      if (elkEdge) {
        return {
          ...original,
          source: elkEdge.sources[0],
          target: elkEdge.targets[0],
        };
      }
      return original; // si ELK n’a rien renvoyé, on garde l’original
    });

    // ⚡ Nodes recalculés avec positions
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
