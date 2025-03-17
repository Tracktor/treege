import { TreeNode } from "@tracktor/types-treege";

const getAllAncestorNamesFromTreeMock: TreeNode = {
  attributes: {
    depth: 0,
    isLeaf: false,
    isRoot: true,
    label: "A",
    name: "a",
    type: "text",
  },
  children: [
    {
      attributes: {
        depth: 1,
        isLeaf: false,
        label: "B",
        name: "b",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 2,
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
