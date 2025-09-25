import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/utils/types";

export type ElkLayoutOptions = Partial<{
  "elk.algorithm": "layered" | "force" | "mrtree";
  "elk.direction": "DOWN" | "RIGHT" | "UP" | "LEFT";
  "elk.edgeRouting": "ORTHOGONAL" | "POLYLINE" | "SPLINES";
  "elk.layered.allowNonFlowPortsToSwitchSides": string;
  "elk.layered.crossingMinimization.semiInteractive": string;
  "elk.layered.nodePlacement.avoidEdgeCrossings": string;
  "elk.layered.spacing.nodeNodeBetweenLayers": string;
  "elk.padding": string;
  "elk.spacing.edgeNode": string;
  "elk.spacing.nodeNode": string;
  "elk.layered.nodePlacement.strategy": string;
  "elk.layered.nodeOrder.strategy": string;
  "elk.layered.nodePlacement.bk.fixedAlignment": string;
  "elk.layered.nodePlacement.favorStraightEdges": string;
  "elk.spacing.edgeEdge": string;
  "elk.layered.mergeEdges": string;
  "elk.layered.mergeHierarchyEdges": string;
  "elk.layered.considerModelOrder": string;
  "elk.layered.cycleBreaking.strategy": string;
  "elk.layered.thoroughness": string;
  "elk.layered.unnecessaryBendpoints": string;
  "elk.layered.wrapping.strategy": string;
  "elk.layered.compaction.postCompaction.strategy": string;
  "elk.layered.compaction.postCompaction.constraints": string;
}>;

const elkOptions: ElkLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.allowNonFlowPortsToSwitchSides": "false",
  "elk.layered.considerModelOrder": "NODES_AND_EDGES",
  "elk.layered.cycleBreaking.strategy": "GREEDY",
  "elk.layered.mergeEdges": "false",
  "elk.layered.mergeHierarchyEdges": "false",
  "elk.layered.nodeOrder.strategy": "DF_MODELORDER",
  "elk.layered.nodePlacement.avoidEdgeCrossings": "true",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFTUP",
  "elk.layered.nodePlacement.favorStraightEdges": "true",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.spacing.nodeNodeBetweenLayers": "150",
  "elk.layered.thoroughness": "7",
  "elk.layered.unnecessaryBendpoints": "true",
  "elk.layered.wrapping.strategy": "OFF",
  "elk.padding": "[top=50,left=50,bottom=50,right=50]",
  "elk.spacing.edgeEdge": "50",
  "elk.spacing.edgeNode": "100",
  "elk.spacing.nodeNode": "80",
};

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

const getHandlePosition = (node: Node, position: Position) => {
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
};

const getDistanceFromNodeToPoint = (node: Node, point: ElkPoint): number => {
  const nodeLeft = node.position.x;
  const nodeRight = node.position.x + (node.width ?? 200);
  const nodeTop = node.position.y;
  const nodeBottom = node.position.y + (node.height ?? 150);

  const dx = Math.max(nodeLeft - point.x, 0, point.x - nodeRight);
  const dy = Math.max(nodeTop - point.y, 0, point.y - nodeBottom);

  return Math.sqrt(dx * dx + dy * dy);
};

const adjustEdgePoints = (points: ElkPoint[], nodes: Node[], minDistance: number = 50): ElkPoint[] =>
  points.map((point, index, arr) =>
    index === 0 || index === arr.length - 1
      ? point
      : nodes.reduce<ElkPoint>((accPoint, node) => {
          const distance = getDistanceFromNodeToPoint(node, accPoint);

          if (distance >= minDistance) return accPoint;

          const nodeCenter = {
            x: node.position.x + (node.width ?? 200) / 2,
            y: node.position.y + (node.height ?? 150) / 2,
          };

          const dx = accPoint.x - nodeCenter.x;
          const dy = accPoint.y - nodeCenter.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          return length > 0
            ? {
                x: nodeCenter.x + (dx * (minDistance + (node.width ?? 200) / 2)) / length,
                y: nodeCenter.y + (dy * (minDistance + (node.width ?? 200) / 2)) / length,
              }
            : accPoint;
        }, point),
  );

export const computeGraphLayout = async (
  nodes: Node<CustomNodeData>[],
  edges: Edge[],
  options: ElkLayoutOptions = {},
): Promise<{ nodes: Node<CustomNodeData>[]; edges: Edge[] }> => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";

  const nodeIds = new Set(nodes.map((n) => n.id));
  const elkEdges: ElkEdge[] = edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

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

  const layoutedGraph = await elk.layout(graph);

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

  const elkEdgeMap = new Map<string, ElkEdgeWithSections>(((layoutedGraph.edges ?? []) as ElkEdgeWithSections[]).map((e) => [e.id, e]));

  const layoutedEdges: Edge[] = edges.map((original) => {
    const elkEdge = elkEdgeMap.get(original.id);

    if (elkEdge?.sections?.length) {
      const section = elkEdge.sections[0];
      let points: ElkPoint[] = [section.startPoint, ...(section.bendPoints ?? []), section.endPoint];

      const sourceNode = newLayoutNodes.find((n) => n.id === original.source);
      const targetNode = newLayoutNodes.find((n) => n.id === original.target);

      if (sourceNode) {
        points[0] = getHandlePosition(sourceNode, sourceNode.sourcePosition ?? Position.Bottom);
      }

      if (targetNode) {
        points[points.length - 1] = getHandlePosition(targetNode, targetNode.targetPosition ?? Position.Top);
      }

      const nodesExcludingSourceTarget = newLayoutNodes.filter((n) => n.id !== original.source && n.id !== original.target);
      points = adjustEdgePoints(points, nodesExcludingSourceTarget, 40);

      return {
        ...original,
        data: {
          ...original.data,
          elkPoints: points,
        },
      };
    }

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
