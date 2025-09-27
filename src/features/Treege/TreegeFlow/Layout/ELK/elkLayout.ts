import { Edge, Node, Position } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import ELKOptionConfig, { ElkLayoutOptions } from "@/features/Treege/TreegeFlow/Layout/ELK/ELKOptionConfig";

const elk = new ELK();

/**
 * Generic ELK layout function for any Node<T extends Record<string, unknown>>.
 */
const elkLayout = async <T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  options: ElkLayoutOptions = {},
): Promise<{ nodes: Node<T>[]; edges: Edge[] }> => {
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
    layoutOptions: { ...ELKOptionConfig, ...options },
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
