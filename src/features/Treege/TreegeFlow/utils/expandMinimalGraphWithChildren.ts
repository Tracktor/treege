import { Attributes, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

/**
 * Expand a MinimalGraph:
 * - Turns each node’s `children` into real option nodes and edges with UUIDs.
 */
const expandMinimalGraphWithChildren = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  const existingNodeUuids = new Set(graph.nodes.map((n) => n.uuid));
  const existingEdgeUuids = new Set(graph.edges.map((e) => e.uuid));

  const addNodeIfNotExists = (node: MinimalNode) => {
    if (!existingNodeUuids.has(node.uuid)) {
      extraNodes.push(node);
      existingNodeUuids.add(node.uuid);
    }
  };

  const addEdgeIfNotExists = (edge: MinimalEdge) => {
    if (!existingEdgeUuids.has(edge.uuid)) {
      extraEdges.push(edge);
      existingEdgeUuids.add(edge.uuid);
    }
  };

  const walkChildren = (parent: MinimalNode, children: (MinimalNode | Attributes)[]) => {
    children.forEach((child) => {
      if ("attributes" in child && "uuid" in child) {
        // child est un MinimalNode
        const edgeUuid = getUUID();
        addEdgeIfNotExists({
          source: parent.uuid,
          target: child.uuid,
          type: child.attributes.type ?? "option",
          uuid: edgeUuid,
        });
        addNodeIfNotExists(child);
        if (child.children?.length) {
          walkChildren(child, child.children);
        }
      } else {
        // child est Attributes
        const childAttr = child as Attributes;
        const childUuid = getUUID();
        const edgeUuid = getUUID();

        const newChildNode: MinimalNode = {
          attributes: {
            ...childAttr,
            type: childAttr.type ?? "option",
          },
          children: [],
          uuid: childUuid,
        };

        addNodeIfNotExists(newChildNode);
        addEdgeIfNotExists({
          source: parent.uuid,
          target: childUuid,
          type: "option",
          uuid: edgeUuid,
        });
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

export default expandMinimalGraphWithChildren;
