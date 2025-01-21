import { TreeNode } from "@/features/Treege/type/TreeNode";

const getAllAncestorNamesFromTreeMock: TreeNode = {
  attributes: {
    isLeaf: false,
    isRoot: true,
    label: "A",
    name: "a",
    type: "text",
  },
  children: [
    {
      attributes: {
        isLeaf: false,
        label: "B",
        name: "b",
        type: "text",
      },
      children: [
        {
          attributes: {
            isLeaf: true,
            label: "C",
            name: "c",
            type: "text",
          },
          children: [],
          uuid: ":r3d:",
        },
      ],
      uuid: ":r2n:",
    },
  ],
  uuid: ":r21:",
};

export default getAllAncestorNamesFromTreeMock;
