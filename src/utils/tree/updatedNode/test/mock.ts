import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { tree: TreeNode; output: TreeNode; treePath: string; newChild: TreeNode; name: string };

const updatedFirstNodeInTreeMock: Mock = {
  name: "userName",
  newChild: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Email",
      type: "email",
    },
    children: [],
    name: "email",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Email",
      type: "email",
    },
    children: [],
    name: "email",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Username",
      type: "text",
    },
    children: [],
    name: "userName",
  },
  treePath: "",
};

const updatedNodeInOtherTreeMock: Mock = {
  name: "type",
  newChild: {
    attributes: {
      depth: 1,
      isLeaf: true,
      isRoot: false,
      label: "Type",
      type: "radio",
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
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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
                  isRoot: false,
                  label: "Type",
                  type: "radio",
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
            treeId: "2",
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
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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
            treeId: "2",
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
  treePath: "/treeCatalog",
};

const updatedTreeMock: Mock = {
  name: "treeCatalog",
  newChild: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [],
    name: "name",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [],
    name: "name",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
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
        treeId: "2",
      },
      treePath: "/treeCatalog",
      type: "tree",
    },
    children: [],
    name: "treeCatalog",
  },
  treePath: "",
};

const updatedNodeInComplexeTreeMock: Mock = {
  name: "password",
  newChild: {
    attributes: {
      depth: 1,
      isLeaf: true,
      isRoot: false,
      label: "Telephone",
      type: "tel",
    },
    children: [],
    name: "phoneNumber",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: false,
          isRoot: false,
          label: "Adresse",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Tree Catalog",
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
                      isLeaf: false,
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
                    children: [
                      {
                        attributes: {
                          depth: 2,
                          isLeaf: true,
                          label: "Contact conducteur",
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
                                  isRoot: false,
                                  label: "Telephone",
                                  type: "tel",
                                },
                                children: [],
                                name: "phoneNumber",
                              },
                            ],
                            name: "username",
                            treeId: "1",
                          },
                          treePath: "/treeCatalog/conductor",
                          type: "tree",
                        },
                        children: [],
                        name: "conductor",
                      },
                    ],
                    name: "type",
                  },
                ],
                name: "machineName",
                treeId: "2",
              },
              treePath: "/treeCatalog",
              type: "tree",
            },
            children: [],
            name: "treeCatalog",
          },
        ],
        name: "address",
      },
    ],
    name: "name",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: false,
          isRoot: false,
          label: "Adresse",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Tree Catalog",
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
                      isLeaf: false,
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
                    children: [
                      {
                        attributes: {
                          depth: 2,
                          isLeaf: true,
                          label: "Contact conducteur",
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
                            treeId: "1",
                          },
                          treePath: "/treeCatalog/conductor",
                          type: "tree",
                        },
                        children: [],
                        name: "conductor",
                      },
                    ],
                    name: "type",
                  },
                ],
                name: "machineName",
                treeId: "2",
              },
              treePath: "/treeCatalog",
              type: "tree",
            },
            children: [],
            name: "treeCatalog",
          },
        ],
        name: "address",
      },
    ],
    name: "name",
  },
  treePath: "/treeCatalog/conductor",
};

const updatedAndAddDecisionInFieldWithChildrenMock: Mock = {
  name: "select",
  newChild: {
    attributes: {
      depth: 1,
      isDecision: true,
      isLeaf: false,
      isRoot: false,
      label: "Select",
      type: "select",
    },
    children: [
      {
        attributes: {
          depth: 2,
          label: "A",
          value: "A",
        },
        children: [
          {
            attributes: {
              depth: 3,
              isLeaf: true,
              label: "FieldA",
              type: "text",
            },
            children: [],
            name: "fieldA",
          },
        ],
        name: "select:A",
      },
      {
        attributes: {
          depth: 2,
          label: "B",
          value: "B",
        },
        children: [
          {
            attributes: {
              depth: 3,
              isLeaf: false,
              label: "FieldB",
              type: "text",
            },
            children: [
              {
                attributes: {
                  depth: 4,
                  isLeaf: true,
                  label: "FieldB2",
                  type: "text",
                },
                children: [],
                name: "fieldB2",
              },
            ],
            name: "fieldB",
          },
        ],
        name: "select:B",
      },
      {
        attributes: {
          depth: 2,
          label: "C",
          value: "C",
        },
        children: [
          {
            attributes: {
              depth: 3,
              isLeaf: true,
              label: "FieldC",
              type: "text",
            },
            children: [],
            name: "fieldC",
          },
        ],
        name: "select:C",
      },
      {
        attributes: {
          depth: 2,
          isLeaf: true,
          label: "D",
          value: "D",
        },
        children: [],
        name: "select:D",
      },
    ],
    name: "select",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
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
          isRoot: false,
          label: "Select",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              label: "A",
              value: "A",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "FieldA",
                  type: "text",
                },
                children: [],
                name: "fieldA",
              },
            ],
            name: "select:A",
          },
          {
            attributes: {
              depth: 2,
              label: "B",
              value: "B",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: false,
                  label: "FieldB",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "FieldB2",
                      type: "text",
                    },
                    children: [],
                    name: "fieldB2",
                  },
                ],
                name: "fieldB",
              },
            ],
            name: "select:B",
          },
          {
            attributes: {
              depth: 2,
              label: "C",
              value: "C",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "FieldC",
                  type: "text",
                },
                children: [],
                name: "fieldC",
              },
            ],
            name: "select:C",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "D",
              value: "D",
            },
            children: [],
            name: "select:D",
          },
        ],
        name: "select",
      },
    ],
    name: "name",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
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
          isRoot: false,
          label: "Select",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: false,
              label: "A",
              value: "A",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "FieldA",
                  type: "text",
                },
                children: [],
                name: "fieldA",
              },
            ],
            name: "select:A",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: false,
              label: "B",
              value: "B",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: false,
                  label: "FieldB",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "FieldB2",
                      type: "text",
                    },
                    children: [],
                    name: "fieldB2",
                  },
                ],
                name: "fieldB",
              },
            ],
            name: "select:B",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: false,
              label: "C",
              value: "C",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "FieldC",
                  type: "text",
                },
                children: [],
                name: "fieldC",
              },
            ],
            name: "select:C",
          },
        ],
        name: "select",
      },
    ],
    name: "name",
  },
  treePath: "",
};

export {
  updatedFirstNodeInTreeMock,
  updatedNodeInOtherTreeMock,
  updatedTreeMock,
  updatedNodeInComplexeTreeMock,
  updatedAndAddDecisionInFieldWithChildrenMock,
};
