import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const TreeData: {
  label: string;
  value: TreeNode | "new";
}[] = [
  {
    label: "Ajouter un arbre",
    value: "new",
  },
  {
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
