import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode | null; searchName: string };

const treeWithTree: TreeNode = {
  attributes: {
    isRoot: true,
    label: "Username",
    name: "username",
    type: "text",
  },
  children: [
    {
      attributes: {
        label: "Email",
        name: "email",
        type: "text",
      },
      children: [
        {
          attributes: {
            isDecision: true,
            isLeaf: true,
            label: "TreeCatalog",
            name: "machineName",
            tree: {
              attributes: {
                isRoot: true,
                label: "Nom de la machine",
                name: "machineName",
                type: "text",
              },
              children: [
                {
                  attributes: {
                    isLeaf: true,
                    label: "Type",
                    name: "type",
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
            treePath: "/treeCatalog",
            type: "tree",
          },
          children: [],
          uuid: "treeCatalog",
        },
      ],
      uuid: "email",
    },
  ],
  uuid: "username",
};

export const simpleTree: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "userName",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "Gender",
              name: "gender",
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
            uuid: "gender",
          },
        ],
        uuid: "email",
      },
    ],
    uuid: "UserName",
  },
  output: {
    attributes: {
      isLeaf: true,
      label: "Gender",
      name: "gender",
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
    uuid: "gender",
  },
  searchName: "gender",
};

export const treeWithDecision: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "Username",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          label: "Email",
          name: "email",
          type: "text",
        },
        children: [
          {
            attributes: {
              isDecision: true,
              isLeaf: false,
              label: "Gender",
              name: "gender",
              type: "select",
            },
            children: [
              {
                attributes: {
                  label: "Male",
                  name: "gender:maleField",
                  value: "male",
                },
                children: [
                  {
                    attributes: {
                      isLeaf: true,
                      label: "MaleField",
                      name: "maleField",
                      type: "text",
                    },
                    children: [],
                    uuid: "maleField",
                  },
                ],
                uuid: "gender:male",
              },
              {
                attributes: {
                  label: "Female",
                  name: "gender:female",
                  value: "female",
                },
                children: [
                  {
                    attributes: {
                      isLeaf: true,
                      label: "FemaleField",
                      name: "femaleField",
                      type: "text",
                    },
                    children: [],
                    uuid: "femaleField",
                  },
                ],
                uuid: "gender:female",
              },
            ],
            uuid: "gender",
          },
        ],
        uuid: "email",
      },
    ],
    uuid: "username",
  },
  output: {
    attributes: {
      isLeaf: true,
      label: "MaleField",
      name: "maleField",
      type: "text",
    },
    children: [],
    uuid: "maleField",
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
      isDecision: true,
      isLeaf: true,
      label: "TreeCatalog",
      name: "machineName",
      tree: {
        attributes: {
          isRoot: true,
          label: "Nom de la machine",
          name: "machineName",
          type: "text",
        },
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "Type",
              name: "type",
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
      treePath: "/treeCatalog",
      type: "tree",
    },
    children: [],
    uuid: "treeCatalog",
  },
  searchName: "treeCatalog",
};
