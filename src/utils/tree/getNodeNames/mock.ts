import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode; treePath: string; name: string };

export const treeInTreeMock: Mock = {
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
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Sales",
              tree: {
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
                      label: "Password",
                      type: "text",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 2,
                          isLeaf: true,
                          label: "CatalogInUserTree",
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
                          treePath: "/sales/catalog",
                          type: "tree",
                        },
                        children: [],
                        name: "catalog",
                      },
                    ],
                    name: "password",
                  },
                ],
                name: "username",
              },
              treePath: "/sales",
              type: "tree",
            },
            children: [],
            name: "sales",
          },
        ],
        name: "treeCatalog",
      },
    ],
    name: "username",
  },
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
