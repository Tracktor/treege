import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/utils/types";

export interface ElkNode {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

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
  // "elk.layered.allowNonFlowPortsToSwitchSides": "false",
  // "elk.layered.considerModelOrder": "NODES_AND_EDGES",
  // "elk.layered.cycleBreaking.strategy": "GREEDY",
  "elk.layered.mergeEdges": "false",
  "elk.layered.mergeHierarchyEdges": "false",
  "elk.layered.nodeOrder.strategy": "DF_MODELORDER",
  "elk.layered.nodePlacement.avoidEdgeCrossings": "true",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFTUP",
  "elk.layered.nodePlacement.favorStraightEdges": "true",
  "elk.layered.nodePlacement.strategy": "INTERACTIVE",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  // "elk.layered.thoroughness": "7",
  "elk.layered.unnecessaryBendpoints": "true",
  // "elk.layered.wrapping.strategy": "OFF",
  "elk.padding": "[top=150,left=150,bottom=150,right=150]",
  "elk.spacing.edgeEdge": "100",
  "elk.spacing.edgeNode": "100",
  "elk.spacing.nodeNode": "100",
};

const elk = new ELK();

export const computeGraphLayout = async (
  nodes: Node<CustomNodeData>[],
  edges: Edge[],
  options: ElkLayoutOptions = {},
): Promise<{ nodes: Node<CustomNodeData>[]; edges: Edge[] }> => {
  const graph = {
    children: nodes.map((node) => ({
      height: node.height ?? 150,
      id: node.id,
      width: node.width ?? 200,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
    id: "root",
    layoutOptions: { ...elkOptions, ...options },
  };

  const layoutedGraph = await elk.layout(graph);

  const nodePositions = new Map(
    ((layoutedGraph.children as ElkNode[]) ?? []).map((n) => [n.id, { height: n.height, width: n.width, x: n.x ?? 0, y: n.y ?? 0 }]),
  );

  const newNodes = nodes.map((node) => {
    const pos = nodePositions.get(node.id);
    return pos
      ? {
          ...node,
          height: pos.height,
          position: { x: pos.x, y: pos.y },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          width: pos.width,
        }
      : node;
  });

  return { edges, nodes: newNodes };
};

export default computeGraphLayout;
