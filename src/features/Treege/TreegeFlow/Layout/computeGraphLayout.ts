import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

export type ElkLayoutOptions = Partial<{
  "elk.algorithm": "layered" | "force" | "mrtree";
  "elk.direction": "DOWN" | "RIGHT" | "UP" | "LEFT";
  "elk.edgeRouting": "ORTHOGONAL" | "POLYLINE" | "SPLINES" | "AVOID_OVERLAP";
  "elk.layered.spacing.nodeNodeBetweenLayers": string;
  "elk.padding": string;
  "elk.spacing.edgeNode": string;
  "elk.spacing.nodeNode": string;
  "elk.layered.nodePlacement.strategy": string;
  "elk.layered.nodeOrder.strategy": string;
}>;

interface ElkPoint {
  x: number;
  y: number;
}

interface ElkSection {
  startPoint: ElkPoint;
  endPoint: ElkPoint;
  bendPoints?: ElkPoint[];
}

interface ElkEdgeWithSections {
  id: string;
  sources: string[];
  targets: string[];
  sections?: ElkSection[];
}

type ElkEdge = {
  id: string;
  sources: string[];
  targets: string[];
};

const elk = new ELK();

// 👇 Helper pour récupérer la position exacte du handle
function getHandlePosition(node: Node, position: Position) {
  const width = node.width ?? 200;
  const height = node.height ?? 150;
  const { x } = node.position;
  const { y } = node.position;

  switch (position) {
    case Position.Bottom:
      return { x: x + width / 2, y: y + height };
    case Position.Top:
      return { x: x + width / 2, y };
    case Position.Left:
      return { x, y: y + height / 2 };
    case Position.Right:
      return { x: x + width, y: y + height / 2 };
    default:
      return { x, y };
  }
}

const elkOptions: ElkLayoutOptions = {
  "elk.algorithm": "mrtree",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "POLYLINE",
  "elk.padding": "[top=50,left=50,bottom=50,right=50]",
  "elk.spacing.edgeNode": "50",
  "elk.spacing.nodeNode": "50",
};

export const computeGraphLayout = async (
  nodes: Node<CustomNodeData>[],
  edges: Edge[],
  options: ElkLayoutOptions = {},
): Promise<{ nodes: Node<CustomNodeData>[]; edges: Edge[] }> => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";

  // 1️⃣ Préparation edges pour ELK
  const nodeIds = new Set(nodes.map((n) => n.id));
  const elkEdges: ElkEdge[] = edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

  // 2️⃣ Préparation nodes pour ELK
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

  // 3️⃣ Layout via ELK
  const layoutedGraph = await elk.layout(graph);

  // 4️⃣ Convert back nodes
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

  // 5️⃣ Convert back edges + elkPoints
  const elkEdgeMap = new Map<string, ElkEdgeWithSections>(((layoutedGraph.edges ?? []) as ElkEdgeWithSections[]).map((e) => [e.id, e]));

  const layoutedEdges: Edge[] = edges.map((original) => {
    const elkEdge = elkEdgeMap.get(original.id);

    if (elkEdge?.sections?.length) {
      const section = elkEdge.sections[0];
      const points: ElkPoint[] = [section.startPoint, ...(section.bendPoints ?? []), section.endPoint];

      const sourceNode = newLayoutNodes.find((n) => n.id === original.source);
      const targetNode = newLayoutNodes.find((n) => n.id === original.target);

      if (sourceNode) {
        points[0] = getHandlePosition(sourceNode, sourceNode.sourcePosition ?? Position.Bottom);
      }

      if (targetNode) {
        points[points.length - 1] = getHandlePosition(targetNode, targetNode.targetPosition ?? Position.Top);
      }

      return {
        ...original,
        data: {
          ...original.data,
          elkPoints: points,
        },
      };
    }

    // fallback si ELK n’a pas renvoyé de sections
    const srcNode = newLayoutNodes.find((n) => n.id === original.source);
    const tgtNode = newLayoutNodes.find((n) => n.id === original.target);
    return {
      ...original,
      data: {
        ...original.data,
        elkPoints: [
          srcNode ? getHandlePosition(srcNode, srcNode.sourcePosition ?? Position.Bottom) : { x: 0, y: 0 },
          tgtNode ? getHandlePosition(tgtNode, tgtNode.targetPosition ?? Position.Top) : { x: 0, y: 0 },
        ],
      },
    };
  });

  return { edges: layoutedEdges, nodes: newLayoutNodes };
};

export default computeGraphLayout;
