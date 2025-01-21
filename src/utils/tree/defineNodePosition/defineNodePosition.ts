import { TreeNode } from "@/features/Treege/type/TreeNode";

interface defineNodePositionParams {
  attributes: TreeNode["attributes"];
  hasChildren: boolean;
  isRoot?: boolean;
}

const defineNodePosition = ({ attributes, isRoot, hasChildren }: defineNodePositionParams): TreeNode["attributes"] => ({
  ...attributes,
  ...(!hasChildren && !attributes.isDecision && { isLeaf: true }),
  ...(isRoot && { isRoot: true }),
});

export default defineNodePosition;
