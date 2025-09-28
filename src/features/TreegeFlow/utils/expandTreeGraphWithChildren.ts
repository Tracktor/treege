import { TreeEdge, TreeGraph, TreeNode } from "@/features/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

/**
 * Expand a TreeGraph:
 * - Turns each node’s `children` into real option nodes and edges with UUIDs.
 */
const expandTreeGraphWithChildren = (graph: TreeGraph): TreeGraph => {
  const baseNodes = graph.nodes ?? [];
  const baseEdges = graph.edges ?? [];

  const extraNodes: TreeNode[] = [];
  const extraEdges: TreeEdge[] = [];

  const existingNodeUuids = new Set(baseNodes.map((n) => n.uuid));
  const existingEdgeUuids = new Set(baseEdges.map((e) => e.uuid));

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
        type: child.attributes?.type ?? "option",
        uuid: edgeUuid,
      });

      addNodeIfNotExists(child);

      if (child.children?.length) {
        walkChildren(child, child.children);
      }
    });
  };

  baseNodes.forEach((node) => {
    if (node.children?.length) {
      walkChildren(node, node.children);
    }
  });

  return {
    edges: [...baseEdges, ...extraEdges],
    nodes: [...baseNodes, ...extraNodes],
  };
};

export default expandTreeGraphWithChildren;
