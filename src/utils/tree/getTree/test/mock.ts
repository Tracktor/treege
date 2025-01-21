import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode; searchPath: string };

const treeInCurrentTreeMock: Mock = {
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
          isLeaf: true,
          label: "tree Catalog",
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
    uuid: "userName",
  },
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
  searchPath: "/treeCatalog",
};

const treeInMainTreeMock: Mock = {
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
    uuid: "username",
  },
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
  searchPath: "/treeCatalog",
};

const multiplTreeInMainTreeMock: Mock = {
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
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "Sales",
              name: "sales",
              tree: {
                attributes: {
                  isRoot: true,
                  label: "Username",
                  name: "username",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      isLeaf: true,
                      label: "Password",
                      name: "password",
                      type: "text",
                    },
                    children: [],
                    uuid: "password",
                  },
                ],
                uuid: "username",
              },
              treePath: "/sales",
              type: "tree",
            },
            children: [],
            uuid: "sales",
          },
        ],
        uuid: "treeCatalog",
      },
    ],
    uuid: "username",
  },
  output: {
    attributes: {
      isRoot: true,
      label: "Username",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          isLeaf: true,
          label: "Password",
          name: "password",
          type: "text",
        },
        children: [],
        uuid: "password",
      },
    ],
    uuid: "username",
  },
  searchPath: "/sales",
};

const treeInTreeMock: Mock = {
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
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "Sales",
              name: "sales",
              tree: {
                attributes: {
                  isRoot: true,
                  label: "Username",
                  name: "username",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      label: "Password",
                      name: "password",
                      type: "text",
                    },
                    children: [
                      {
                        attributes: {
                          isLeaf: true,
                          label: "CatalogInUserTree",
                          name: "catalog",
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
                          treePath: "/sales/catalog",
                          type: "tree",
                        },
                        children: [],
                        uuid: "catalog",
                      },
                    ],
                    uuid: "password",
                  },
                ],
                uuid: "username",
              },
              treePath: "/sales",
              type: "tree",
            },
            children: [],
            uuid: "sales",
          },
        ],
        uuid: "treeCatalog",
      },
    ],
    uuid: "username",
  },
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
  searchPath: "/sales/catalog",
};

const treeInDecisionMock: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "Name",
      name: "name",
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
              isLeaf: true,
              label: "Male",
              name: "gender:male",
              value: "male",
            },
            children: [],
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
            uuid: "gender:female",
          },
        ],
        uuid: "gender",
      },
    ],
    uuid: "name",
  },
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
  searchPath: "/treeCatalog",
};

const complexeMockWithDecisionMock: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "name",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          isLeaf: true,
          label: "userTree",
          name: "userTree",
          tree: {
            attributes: {
              isRoot: true,
              label: "Username",
              name: "userTree",
              type: "text",
            },
            children: [
              {
                attributes: {
                  label: "Password",
                  name: "username",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      isDecision: true,
                      isLeaf: false,
                      label: "selectDecision",
                      name: "password",
                      type: "select",
                    },
                    children: [
                      {
                        attributes: {
                          isLeaf: true,
                          label: "Value1",
                          name: "password:Value1",
                          value: "Value1",
                        },
                        children: [],
                        uuid: "selectDecision:Value1",
                      },
                      {
                        attributes: {
                          label: "Value2",
                          name: "password:Value2",
                          value: "Value2",
                        },
                        children: [
                          {
                            attributes: {
                              isLeaf: true,
                              label: "treeCatalog",
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
                              treePath: "/userTree/treeCatalog",
                              type: "tree",
                            },
                            children: [],
                            uuid: "treeCatalog",
                          },
                        ],
                        uuid: "selectDecision:Value2",
                      },
                    ],
                    uuid: "selectDecision",
                  },
                ],
                uuid: "password",
              },
            ],
            uuid: "username",
          },
          treePath: "/userTree",
          type: "tree",
        },
        children: [],
        uuid: "userTree",
      },
    ],
    uuid: "name",
  },
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
