import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import ELKOptionConfig, { ElkLayoutOptions } from "@/features/TreegeFlow/Layout/ELK/ELKOptionConfig";

const elk = new ELK();

// un Node dont data peut contenir attributes.type
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
  options: ElkLayoutOptions = {},
): Promise<{ nodes: NodeWithAttributes<T>[]; edges: Edge[] }> => {
  const graph = {
    children: nodes.map((node) => {
      // Détection sûre de l’option
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
      ...options,
      "elk.algorithm": "layered",
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
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          width: pos.width,
        }
      : node;
  });

  return { edges, nodes: newNodes };
};

export default elkLayout;
