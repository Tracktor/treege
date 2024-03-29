import type { TreeNode } from "@/features/Treege/type/TreeNode";

const TreeData: {
  id: string;
  label: string;
  value: TreeNode;
}[] = [
  {
    id: "1",
    label: "User",
    value: {
      attributes: {
        depth: 0,
        isRoot: true,
        label: "Username",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 1,
            isLeaf: true,
            label: "Password",
            type: "text",
          },
          children: [],
          name: "password",
        },
      ],
      name: "username",
    },
  },
  {
    id: "2",
    label: "Catalog",
    value: {
      attributes: {
        depth: 0,
        isRoot: true,
        label: "Nom de la machine",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 1,
            isLeaf: true,
            label: "Type",
            type: "select",
            values: [
              {
                id: "0",
                label: "Mini-pelle",
                value: "minipelle",
              },
              {
                id: "1",
                label: "Nacelle",
                value: "nacelle",
              },
            ],
          },
          children: [],
          name: "type",
        },
      ],
      name: "machineName",
    },
  },
];

export default TreeData;
