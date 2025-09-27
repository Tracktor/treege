import { TreeEdge, TreeNode } from "@/features/Treege/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

export type TreeGraph = {
  nodes: TreeNode[];
  edges: TreeEdge[];
};

/**
 * Expand a TreeGraph:
 * - Turns each node’s `children` into real option nodes and edges with UUIDs.
 */
const expandTreeGraphWithChildren = (graph: TreeGraph): TreeGraph => {
  const extraNodes: TreeNode[] = [];
  const extraEdges: TreeEdge[] = [];

  const existingNodeUuids = new Set(graph.nodes.map((n) => n.uuid));
  const existingEdgeUuids = new Set(graph.edges.map((e) => e.uuid));

  const addNodeIfNotExists = (node: TreeNode) => {
    if (!existingNodeUuids.has(node.uuid)) {
      extraNodes.push(node);
      existingNodeUuids.add(node.uuid);
    }
  };

  const addEdgeIfNotExists = (edge: TreeEdge) => {
    if (!existingEdgeUuids.has(edge.uuid)) {
      extraEdges.push(edge);
      existingEdgeUuids.add(edge.uuid);
    }
  };

  const walkChildren = (parent: TreeNode, children: TreeNode[]) => {
    children.forEach((child) => {
      const edgeUuid = getUUID();

      addEdgeIfNotExists({
        source: parent.uuid,
        target: child.uuid,
        type: "type" in child.attributes ? child.attributes.type : "option",
        uuid: edgeUuid,
      });

      addNodeIfNotExists(child);

      if (child.children?.length) {
        walkChildren(child, child.children);
      }
    });
  };

  graph.nodes.forEach((node) => {
    if (node.children?.length) {
      walkChildren(node, node.children);
    }
  });

  return {
    edges: [...graph.edges, ...extraEdges],
    nodes: [...graph.nodes, ...extraNodes],
  };
};

export default expandTreeGraphWithChildren;
