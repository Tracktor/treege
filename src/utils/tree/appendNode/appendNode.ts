import type { TreeNode } from "@/features/Treege/type/TreeNode";
import defineNodePosition from "@/utils/tree/defineNodePosition/defineNodePosition";
import getNode from "@/utils/tree/getNode/getNode";

interface AppendChildParams {
  tree: TreeNode | null;
  path: string | null;
  uuid: string;
  child: TreeNode;
}

/**
 * Add child by reference
 * @param node
 * @param child
 */
const addChildByRef = (node: TreeNode | null, child: TreeNode) => {
  if (!node) {
    return null;
  }

  const { attributes } = child;
  const isChildDecision = attributes.isDecision;
  const existingChildren = node.children;

  // Set parent node attributes
  Object.defineProperty(node, "attributes", {
    value: defineNodePosition({
      attributes: node.attributes,
      hasChildren: true, // Node will have a child, so hasChildren = true
    }),
  });

  if (isChildDecision) {
    Object.defineProperty(node, "children", {
      value: [
        {
          ...child,
          attributes: defineNodePosition({
            attributes,
            hasChildren: child.children.length > 0,
          }),
        },
      ],
    });
    return null;
  }

  // For a regular node
  Object.defineProperty(node, "children", {
    value: [
      {
        ...child,
        // Keep existing children
        attributes: defineNodePosition({
          attributes,
          hasChildren: child.children.length > 0 || existingChildren.length > 0,
        }),
        children: existingChildren,
      },
    ],
  });

  return null;
};
/**
 * Append child to tree
 * @param tree
 * @param path
 * @param uuid
 * @param child
 */
const appendNode = ({ tree, path, uuid, child }: AppendChildParams) => {
  if (!tree) {
    const hasChildren = child.children.length > 0;

    return {
      ...child,
      attributes: defineNodePosition({
        attributes: child.attributes,
        hasChildren,
        isRoot: true,
      }),
    };
  }
  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, uuid);

  if (node) {
    const hasChildren = child.children.length > 0;

    addChildByRef(node, {
      ...child,
      ...(!child.attributes.isDecision && {
        children: [...(getNode(tree, path, uuid)?.children || [])],
      }),
      attributes: defineNodePosition({
        attributes: child.attributes,
        hasChildren,
      }),
    });
  }

  return treeCopy;
};

export default appendNode;
