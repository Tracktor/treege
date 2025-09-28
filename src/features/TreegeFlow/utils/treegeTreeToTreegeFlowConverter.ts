import type { TreeNode } from "@tracktor/types-treege";
import { TreeEdge, TreeGraph } from "@/features/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

/**
 * Convert a Treege tree structure to a Treege Flow graph structure.
 * Handles decision nodes (radio/select) by converting their options and connecting sub-nodes appropriately.
 *
 * @param tree - The root node of the Treege tree structure.
 * @returns A TreeGraph object containing nodes and edges for Treege Flow.
 */
const treegeTreeToTreegeFlowConverter = (tree: TreeNode): TreeGraph => {
  const nodes: TreeNode[] = [];
  const edges: TreeEdge[] = [];

  const traverse = (node: TreeNode, parentId: string | null = null) => {
    const { attributes, children, uuid } = node;

    const isDecision = attributes.isDecision || attributes.type === "radio";

    const newNode: TreeNode = {
      attributes: {
        depth: attributes.depth,
        helperText: attributes.helperText,
        isDecision,
        isLeaf: attributes.isLeaf,
        isRoot: attributes.isRoot,
        label: attributes.label,
        name: attributes.name,
        tag: attributes.tag,
        type: attributes.type || "text",
      },
      children: [],
      uuid: `node-${uuid}`,
    };

    nodes.push(newNode);

    if (parentId) {
      edges.push({
        source: parentId,
        target: newNode.uuid,
        type: "default",
        uuid: `edge-${getUUID()}`,
      });
    }

    if (isDecision) {
      newNode.children = children.map((child) => ({
        attributes: {
          depth: child.attributes.depth,
          label: child.attributes.label,
          message: child.attributes.message || "",
          name: child.attributes.name,
          value: child.attributes.value || "",
        },
        children: [],
        uuid: child.uuid,
      }));

      children.forEach((child) => {
        const optionNode: TreeNode = {
          attributes: {
            depth: child.attributes.depth,
            isDecision: false,
            label: child.attributes.label,
            name: child.attributes.name,
            type: "option" as any,
          },
          children: [],
          uuid: child.uuid,
        };
        nodes.push(optionNode);

        edges.push({
          source: newNode.uuid,
          target: optionNode.uuid,
          type: "option",
          uuid: `edge-${getUUID()}`,
        });

        if (child.children && child.children.length) {
          child.children.forEach((sub) => traverse(sub, optionNode.uuid));
        }
      });
    } else {
      children.forEach((sub) => traverse(sub, newNode.uuid));
    }
  };

  traverse(tree);

  return { edges, nodes };
};

export default treegeTreeToTreegeFlowConverter;
