import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode; treePath: string; name: string };

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
            name: "treeCatalog",
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

const simpleTree: TreeNode = {
  attributes: {
    isLeaf: true,
    isRoot: true,
    label: "Username",
    name: "userName",
    type: "text",
  },
  children: [],
  uuid: "userName",
};

const simpleTreeMock: Mock = {
  input: simpleTree,
  name: "userName",
  output: simpleTree,
  treePath: "",
};

const treeWithFields: Mock = {
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
        children: [],
        uuid: "email",
      },
    ],
    uuid: "username",
  },
  name: "email",
  output: {
    attributes: {
      label: "Email",
      name: "email",
      type: "text",
    },
    children: [],
    uuid: "email",
  },
  treePath: "",
};

const treeWithTreeMock: Mock = {
  input: treeWithTree,
  name: "machineName",
  output: {
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
};

const mainTreeWithTreeMock: Mock = {
  input: treeWithTree,
  name: "email",
  output: {
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
          name: "treeCatalog",
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
  treePath: "",
};

export { simpleTreeMock, treeWithFields, treeWithTreeMock, mainTreeWithTreeMock };
