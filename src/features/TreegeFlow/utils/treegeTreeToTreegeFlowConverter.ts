import type { TreeNode } from "@tracktor/types-treege";
import { TreeEdge, TreeGraph } from "@/features/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

const treegeTreeToTreegeFlowConverter = (tree: TreeNode): TreeGraph => {
  const nodes: TreeNode[] = [];
  const edges: TreeEdge[] = [];

  const traverse = (node: TreeNode, parentId: string | null = null) => {
    const { attributes, children, uuid } = node;

    const newNode: TreeNode = {
      attributes: {
        depth: attributes.depth,
        helperText: attributes.helperText,
        isDecision: attributes.isDecision || attributes.type === "radio",
        isLeaf: attributes.isLeaf,
        isRoot: attributes.isRoot,
        label: attributes.label,
        name: attributes.name,
        tag: attributes.tag,
        type: attributes.type === "radio" ? "select" : attributes.type || "text",
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

    if (newNode.attributes.isDecision) {
      children.forEach((child) => {
        const optionNode: TreeNode = {
          attributes: {
            depth: child.attributes.depth,
            isLeaf: child.attributes.isLeaf ?? true,
            label: child.attributes.label,
            message: child.attributes.message || "",
            name: child.attributes.name,
            value: child.attributes.value || "",
          },
          children: [],
          uuid: `node-${child.uuid}`,
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
