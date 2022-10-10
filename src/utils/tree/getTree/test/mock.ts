import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode; searchPath: string };

const treeInCurrentTreeMock: Mock = {
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
          isLeaf: true,
          label: "tree Catalog",
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
    name: "userName",
  },
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
  searchPath: "/treeCatalog",
};

const treeInMainTreeMock: Mock = {
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
    name: "username",
  },
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
  searchPath: "/treeCatalog",
};

const multiplTreeInMainTreeMock: Mock = {
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
  output: {
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
  searchPath: "/sales",
};

const treeInTreeMock: Mock = {
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
  searchPath: "/sales/catalog",
};

const treeInDecisionMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isDecision: true,
          isLeaf: false,
          label: "Gender",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Male",
              value: "male",
            },
            children: [],
            name: "gender:male",
          },
          {
            attributes: {
              depth: 2,
              label: "Female",
              value: "female",
            },
            children: [
              {
                attributes: {
                  depth: 3,
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
            name: "gender:female",
          },
        ],
        name: "gender",
      },
    ],
    name: "name",
  },
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
  searchPath: "/treeCatalog",
};

const complexeMockWithDecisionMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "userTree",
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
                      isDecision: true,
                      isLeaf: false,
                      label: "selectDecision",
                      type: "select",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 3,
                          isLeaf: true,
                          label: "Value1",
                          value: "Value1",
                        },
                        children: [],
                        name: "selectDecision:Value1",
                      },
                      {
                        attributes: {
                          depth: 3,
                          label: "Value2",
                          value: "Value2",
                        },
                        children: [
                          {
                            attributes: {
                              depth: 4,
                              isLeaf: true,
                              label: "treeCatalog",
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
                              treePath: "/userTree/treeCatalog",
                              type: "tree",
                            },
                            children: [],
                            name: "treeCatalog",
                          },
                        ],
                        name: "selectDecision:Value2",
                      },
                    ],
                    name: "selectDecision",
                  },
                ],
                name: "password",
              },
            ],
            name: "username",
          },
          treePath: "/userTree",
          type: "tree",
        },
        children: [],
        name: "userTree",
      },
    ],
    name: "name",
  },
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
  searchPath: "/userTree/treeCatalog",
};

export {
  treeInMainTreeMock,
  multiplTreeInMainTreeMock,
  treeInTreeMock,
  treeInDecisionMock,
  treeInCurrentTreeMock,
  complexeMockWithDecisionMock,
};
