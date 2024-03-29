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
        name: "username",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 1,
            isLeaf: true,
            label: "Password",
            name: "email",
            type: "text",
          },
          children: [],
          uuid: "password",
        },
      ],
      uuid: "username",
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
        name: "catalog",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 1,
            isLeaf: true,
            label: "Type",
            name: "machineName",
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
          uuid: "type",
        },
      ],
      uuid: "machineName",
    },
  },
];

export default TreeData;
