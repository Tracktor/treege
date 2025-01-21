import { TreeNode } from "@/features/Treege/type/TreeNode";

interface DefineNodePositionParams {
  attributes: TreeNode["attributes"];
  hasChildren: boolean;
  isRoot?: boolean;
}

export const defineNodePosition = ({ attributes, isRoot, hasChildren }: DefineNodePositionParams): TreeNode["attributes"] => {
  // If it's a decision node, it can never be a leaf
  if (attributes.isDecision) {
    return {
      ...attributes,
      isLeaf: false,
      ...(isRoot && { isRoot: true }),
    };
  }

  // For a regular node, it's a leaf if it has no children
  return {
    ...attributes,
    isLeaf: !hasChildren,
    ...(isRoot && { isRoot: true }),
  };
};

export default defineNodePosition;
