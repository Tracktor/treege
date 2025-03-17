import type { TreeNode } from "@tracktor/types-treege";

type Mock = { input: TreeNode; output: TreeNode | null; searchName: string };

const treeWithTree: TreeNode = {
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
        label: "Email",
        name: "email",
        type: "text",
      },
      children: [
        {
          attributes: {
            depth: 2,
            isDecision: true,
            isLeaf: true,
            label: "TreeCatalog",
            name: "machineName",
            tree: {
              attributes: {
                depth: 0,
                isRoot: true,
                label: "Nom de la machine",
                name: "machineName",
                type: "text",
              },
              children: [
                {
                  attributes: {
                    depth: 1,
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
      depth: 0,
      isRoot: true,
      label: "userName",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
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
      depth: 2,
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
          label: "Email",
          name: "email",
          type: "text",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isDecision: true,
              isLeaf: false,
              label: "Gender",
              name: "gender",
              type: "select",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  label: "Male",
                  name: "gender:maleField",
                  value: "male",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
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
                  depth: 3,
                  label: "Female",
                  name: "gender:female",
                  value: "female",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
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
      depth: 4,
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
      depth: 2,
      isDecision: true,
      isLeaf: true,
      label: "TreeCatalog",
      name: "machineName",
      tree: {
        attributes: {
          depth: 0,
          isRoot: true,
          label: "Nom de la machine",
          name: "machineName",
          type: "text",
        },
        children: [
          {
            attributes: {
              depth: 1,
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
