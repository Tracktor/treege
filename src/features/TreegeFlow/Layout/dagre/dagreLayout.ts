import { Edge, Position } from "@xyflow/react";
import dagre from "dagre";
import { Orientation } from "react-d3-tree";
import { EngineLayoutOutput, NodeWithAttributes } from "@/features/TreegeFlow/utils/types";

const dagreLayout = async <T extends Record<string, unknown>>(
  nodes: NodeWithAttributes<T>[],
  edges: Edge[],
  orientation: Orientation = "vertical",
): Promise<EngineLayoutOutput<T>> => {
  const rankdir = orientation === "horizontal" ? "LR" : "TB";

  const g = new dagre.graphlib.Graph();
  g.setGraph({ nodesep: 100, rankdir, ranksep: 150 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, {
      height: node.height ?? 150,
      width: node.width ?? 200,
    });
  });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  const newNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id) as dagre.Node;
    return dagreNode
      ? {
          ...node,
          height: dagreNode.height,
          position: {
            x: dagreNode.x - dagreNode.width / 2,
            y: dagreNode.y - dagreNode.height / 2,
          },
          sourcePosition: orientation === "horizontal" ? Position.Right : Position.Bottom,
          targetPosition: orientation === "horizontal" ? Position.Left : Position.Top,
          width: dagreNode.width,
        }
      : node;
  });

  return { edges, nodes: newNodes };
};

export default dagreLayout;
