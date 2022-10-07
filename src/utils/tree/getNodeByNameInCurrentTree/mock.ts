import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode | null; searchName: string };

const treeWithTree: TreeNode = {
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
        label: "Email",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 2,
            isDecision: true,
            isLeaf: true,
            label: "TreeCatalog",
            tree: {
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
            treePath: "/treeCatalog",
            type: "tree",
          },
          children: [],
          name: "treeCatalog",
        },
      ],
      name: "email",
    },
  ],
  name: "username",
};

export const simpleTree: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          label: "Email",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Gender",
              type: "select",
              values: [
                {
                  id: "0",
                  label: "Male",
                  value: "male",
                },
                {
                  id: "1",
                  label: "Female",
                  value: "female",
                },
              ],
            },
            children: [],
            name: "gender",
          },
        ],
        name: "email",
      },
    ],
    name: "UserName",
  },
  output: {
    attributes: {
      depth: 2,
      isLeaf: true,
      label: "Gender",
      type: "select",
      values: [
        {
          id: "0",
          label: "Male",
          value: "male",
        },
        {
          id: "1",
          label: "Female",
          value: "female",
        },
      ],
    },
    children: [],
    name: "gender",
  },
  searchName: "gender",
};

export const treeWithDecision: Mock = {
  input: {
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
          label: "Email",
          type: "text",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isDecision: true,
              isLeaf: false,
              label: "Gender",
              type: "select",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  label: "Male",
                  value: "male",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "MaleField",
                      type: "text",
                    },
                    children: [],
                    name: "maleField",
                  },
                ],
                name: "gender:male",
              },
              {
                attributes: {
                  depth: 3,
                  label: "Female",
                  value: "female",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "FemaleField",
                      type: "text",
                    },
                    children: [],
                    name: "femaleField",
                  },
                ],
                name: "gender:female",
              },
            ],
            name: "gender",
          },
        ],
        name: "email",
      },
    ],
    name: "username",
  },
  output: {
    attributes: {
      depth: 4,
      isLeaf: true,
      label: "MaleField",
      type: "text",
    },
    children: [],
    name: "maleField",
  },
  searchName: "maleField",
};

export const treeWithTreeMock: Mock = {
  input: treeWithTree,
  output: treeWithTree,
  searchName: "username",
};

export const treeWithTreeNoMatch: Mock = {
  input: treeWithTree,
  output: null,
  searchName: "type",
};

export const treeWithTreeMatchTree: Mock = {
  input: treeWithTree,
  output: {
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
  searchName: "treeCatalog",
};
