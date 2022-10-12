import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode; treePath: string; name: string };

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

const treeWithFields: Mock = {
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
        children: [],
        name: "email",
      },
    ],
    name: "username",
  },
  name: "email",
  output: {
    attributes: {
      depth: 1,
      label: "Email",
      type: "text",
    },
    children: [],
    name: "email",
  },
  treePath: "",
};

const treeWithTreeMock: Mock = {
  input: treeWithTree,
  name: "machineName",
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
  treePath: "/treeCatalog",
};

const mainTreeWithTreeMock: Mock = {
  input: treeWithTree,
  name: "email",
  output: {
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
  treePath: "",
};

export { simpleTreeMock, treeWithFields, treeWithTreeMock, mainTreeWithTreeMock };
