import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import ELKOptionConfig, { ElkDirection } from "@/features/TreegeFlow/Layout/ELK/ELKOptionConfig";
import { Orientation } from "@/features/TreegeFlow/utils/types";

const elk = new ELK();

type NodeWithAttributes<T> = Node<
  T & {
    attributes?: {
      type?: string;
    };
  }
>;

const elkLayout = async <T extends Record<string, unknown>>(
  nodes: NodeWithAttributes<T>[],
  edges: Edge[],
  orientation: Orientation = "vertical",
): Promise<{ nodes: NodeWithAttributes<T>[]; edges: Edge[] }> => {
  const elkDirection: ElkDirection = orientation === "horizontal" ? "RIGHT" : "DOWN";

  const graph = {
    children: nodes.map((node) => {
      const isOption = node.data?.attributes?.type === "option";

      return {
        height: node.height ?? 150,
        id: node.id,
        layoutOptions: isOption
          ? {
              "elk.layered.nodePlacement": "SAME_LAYER",
            }
          : undefined,
        width: node.width ?? 200,
      };
    }),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
    id: "root",
    layoutOptions: {
      ...ELKOptionConfig,
      "elk.algorithm": "layered",
      "elk.direction": elkDirection,
      "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    },
  };

  const layoutedGraph = await elk.layout(graph);

  const nodePositions = new Map(
    (layoutedGraph.children ?? []).map((n) => [
      n.id,
      {
        height: n.height,
        width: n.width,
        x: n.x ?? 0,
        y: n.y ?? 0,
      },
    ]),
  );

  const newNodes = nodes.map((node) => {
    const pos = nodePositions.get(node.id);
    return pos
      ? {
          ...node,
          height: pos.height,
          position: { x: pos.x, y: pos.y },
          sourcePosition: orientation === "horizontal" ? Position.Right : Position.Bottom,
          targetPosition: orientation === "horizontal" ? Position.Left : Position.Top,
          width: pos.width,
        }
      : node;
  });

  return { edges, nodes: newNodes };
};

export default elkLayout;
