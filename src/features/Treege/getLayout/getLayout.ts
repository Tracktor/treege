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

const elkOptions: ElkLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.nodeOrder.strategy": "INPUT_ORDER",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.layered.spacing.nodeNodeBetweenLayers": "120",
  "elk.padding": "[top=50,left=50,bottom=50,right=50]",
  "elk.spacing.edgeNode": "40",
  "elk.spacing.nodeNode": "80",
};

// 👇 fonction utilitaire pour retrouver la position exacte du handle
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

  // 🔹 On ignore sourceHandle pour ELK
  const elkEdges: ElkEdge[] = edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

  // Trie par ordre
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

    // 🔹 On construit les nodes layoutés
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

    // 🔹 On récupère les points ELK pour chaque edge et on ajuste aux handles ReactFlow
    const elkEdgeMap = new Map<string, ElkEdgeWithSections>(((layoutedGraph.edges ?? []) as ElkEdgeWithSections[]).map((e) => [e.id, e]));

    const layoutedEdges: Edge[] = edges.map((original) => {
      const elkEdge = elkEdgeMap.get(original.id);

      if (elkEdge && elkEdge.sections) {
        const section = elkEdge.sections[0];
        let points: ElkPoint[] = [section.startPoint, ...(section.bendPoints ?? []), section.endPoint];

        const sourceNode = newLayoutNodes.find((n) => n.id === original.source);
        const targetNode = newLayoutNodes.find((n) => n.id === original.target);

        // ⚡ On ajuste le start et end pour coller aux handles + forcer l’orthogonalité
        if (sourceNode) {
          const srcPos = getHandlePosition(sourceNode, sourceNode.sourcePosition ?? Position.Bottom);
          const firstBend = points[1];
          if (firstBend && Math.abs(srcPos.x - firstBend.x) > 1 && Math.abs(srcPos.y - firstBend.y) > 1) {
            // insère un coude orthogonal
            points = [srcPos, { x: srcPos.x, y: firstBend.y }, ...points.slice(1)];
          } else {
            points[0] = srcPos;
          }
        }

        if (targetNode) {
          const tgtPos = getHandlePosition(targetNode, targetNode.targetPosition ?? Position.Top);
          const beforeLast = points[points.length - 2];
          if (beforeLast && Math.abs(tgtPos.x - beforeLast.x) > 1 && Math.abs(tgtPos.y - beforeLast.y) > 1) {
            // insère un coude orthogonal avant d’arriver
            points = [...points.slice(0, -1), { x: beforeLast.x, y: tgtPos.y }, tgtPos];
          } else {
            points[points.length - 1] = tgtPos;
          }
        }

        return {
          ...original,
          data: {
            ...original.data,
            elkPoints: points,
          },
        };
      }
      return original;
    });

    return { edges: layoutedEdges, nodes: newLayoutNodes };
  } catch (error) {
    console.error("ELK Layout error:", error);
    throw error;
  }
};

export default getLayout;
