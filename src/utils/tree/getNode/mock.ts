import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode; treePath: string; name: string };

const simpleTree: TreeNode = {
  attributes: {
    depth: 0,
    isLeaf: true,
    isRoot: true,
    label: "Username",
    type: "text",
  },
  children: [],
  name: "userName",
};

const simpleTreeMock: Mock = {
  input: simpleTree,
  name: "userName",
  output: simpleTree,
  treePath: "",
};

export default simpleTreeMock;
