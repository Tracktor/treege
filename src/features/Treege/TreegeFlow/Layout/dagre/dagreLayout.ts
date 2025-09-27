import { Edge, Node, Position } from "@xyflow/react";
import dagre from "dagre";

export interface DagreLayoutOptions {
  /** Direction du graphe */
  rankdir?: "TB" | "BT" | "LR" | "RL";
  /** Espace entre rangées */
  ranksep?: number;
  /** Espace entre nodes */
  nodesep?: number;
}

type NodeWithAttributes<T> = Node<
  T & {
    attributes?: {
      type?: string;
    };
  }
>;

const dagreLayout = async <T extends Record<string, unknown>>(
  nodes: NodeWithAttributes<T>[],
  edges: Edge[],
  options: DagreLayoutOptions = { nodesep: 100, rankdir: "TB", ranksep: 150 },
): Promise<{ nodes: NodeWithAttributes<T>[]; edges: Edge[] }> => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    nodesep: options.nodesep ?? 100,
    rankdir: options.rankdir ?? "TB",
    ranksep: options.ranksep ?? 150,
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    const width = node.width ?? 200;
    const height = node.height ?? 150;

    const isOption = node.data?.attributes?.type === "option";

    g.setNode(node.id, {
      height,
      rank: isOption ? 1 : undefined,
      width,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

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
          sourcePosition: options.rankdir === "LR" || options.rankdir === "RL" ? Position.Right : Position.Bottom,
          targetPosition: options.rankdir === "LR" || options.rankdir === "RL" ? Position.Left : Position.Top,
          width: dagreNode.width,
        }
      : node;
  });

  return { edges, nodes: newNodes };
};

export default dagreLayout;
