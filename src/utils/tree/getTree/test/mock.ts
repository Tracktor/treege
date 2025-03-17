import type { TreeNode } from "@tracktor/types-treege";

type Mock = { input: TreeNode; output: TreeNode; searchPath: string };

const treeInCurrentTreeMock: Mock = {
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
          isLeaf: true,
          label: "tree Catalog",
          name: "treeCatalog",
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
    uuid: "userName",
  },
  output: {
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
  searchPath: "/treeCatalog",
};

const treeInMainTreeMock: Mock = {
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
          isLeaf: true,
          label: "TreeCatalog",
          name: "treeCatalog",
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
    uuid: "username",
  },
  output: {
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
  searchPath: "/treeCatalog",
};

const multiplTreeInMainTreeMock: Mock = {
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
          label: "TreeCatalog",
          name: "treeCatalog",
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
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Sales",
              name: "sales",
              tree: {
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
          label: "TreeCatalog",
          name: "treeCatalog",
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
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Sales",
              name: "sales",
              tree: {
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
                      label: "Password",
                      name: "password",
                      type: "text",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 2,
                          isLeaf: true,
                          label: "CatalogInUserTree",
                          name: "catalog",
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
  searchPath: "/sales/catalog",
};

const treeInDecisionMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Name",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isDecision: true,
          isLeaf: false,
          label: "Gender",
          name: "gender",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
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
              depth: 2,
              label: "Female",
              name: "gender:female",
              value: "female",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "TreeCatalog",
                  name: "treeCatalog",
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
  searchPath: "/treeCatalog",
};

const complexeMockWithDecisionMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "name",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "userTree",
          name: "userTree",
          tree: {
            attributes: {
              depth: 0,
              isRoot: true,
              label: "Username",
              name: "userTree",
              type: "text",
            },
            children: [
              {
                attributes: {
                  depth: 1,
                  label: "Password",
                  name: "username",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      depth: 2,
                      isDecision: true,
                      isLeaf: false,
                      label: "selectDecision",
                      name: "password",
                      type: "select",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 3,
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
                          depth: 3,
                          label: "Value2",
                          name: "password:Value2",
                          value: "Value2",
                        },
                        children: [
                          {
                            attributes: {
                              depth: 4,
                              isLeaf: true,
                              label: "treeCatalog",
                              name: "treeCatalog",
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
