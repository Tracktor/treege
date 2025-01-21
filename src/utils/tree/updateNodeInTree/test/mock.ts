import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { tree: TreeNode; output: TreeNode; treePath: string; newChild: TreeNode; uuid: string };

const updatedFirstNodeInTreeMock: Mock = {
  newChild: {
    attributes: {
      isLeaf: true,
      isRoot: true,
      label: "Email",
      name: "email",
      type: "email",
    },
    children: [],
    uuid: "email",
  },
  output: {
    attributes: {
      isLeaf: true,
      isRoot: true,
      label: "Email",
      name: "email",
      type: "email",
    },
    children: [],
    uuid: "email",
  },
  tree: {
    attributes: {
      isLeaf: true,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [],
    uuid: "userName",
  },
  treePath: "",
  uuid: "userName",
};

const updatedNodeInOtherTreeMock: Mock = {
  newChild: {
    attributes: {
      isLeaf: true,
      isRoot: false,
      label: "Type",
      name: "type",
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
    uuid: "type",
  },
  output: {
    attributes: {
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          isLeaf: true,
          label: "Tree Catalog",
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
                  isRoot: false,
                  label: "Type",
                  name: "type",
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
                uuid: "type",
              },
            ],
            treeId: "2",
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
  tree: {
    attributes: {
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          isLeaf: true,
          label: "Tree Catalog",
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
            treeId: "2",
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
  treePath: "/treeCatalog",
  uuid: "type",
};

const updatedTreeMock: Mock = {
  newChild: {
    attributes: {
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "name",
      type: "text",
    },
    children: [],
    uuid: "name",
  },
  output: {
    attributes: {
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "name",
      type: "text",
    },
    children: [],
    uuid: "name",
  },
  tree: {
    attributes: {
      isLeaf: true,
      isRoot: true,
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
        treeId: "2",
        uuid: "machineName",
      },
      treePath: "/treeCatalog",
      type: "tree",
    },
    children: [],
    uuid: "treeCatalog",
  },
  treePath: "",
  uuid: "treeCatalog",
};

const updatedNodeInComplexeTreeMock: Mock = {
  newChild: {
    attributes: {
      isLeaf: true,
      isRoot: false,
      label: "Telephone",
      name: "phoneNumber",
      type: "tel",
    },
    children: [],
    uuid: "phoneNumber",
  },
  output: {
    attributes: {
      isLeaf: false,
      isRoot: true,
      label: "Name",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          isLeaf: false,
          isRoot: false,
          label: "Adresse",
          name: "address",
          type: "email",
        },
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "Tree Catalog",
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
                      isLeaf: false,
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
                    children: [
                      {
                        attributes: {
                          isLeaf: true,
                          label: "Contact conducteur",
                          name: "conductor",
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
                                  isRoot: false,
                                  label: "Telephone",
                                  name: "phoneNumber",
                                  type: "tel",
                                },
                                children: [],
                                uuid: "phoneNumber",
                              },
                            ],
                            treeId: "1",
                            uuid: "username",
                          },
                          treePath: "/treeCatalog/conductor",
                          type: "tree",
                        },
                        children: [],
                        uuid: "conductor",
                      },
                    ],
                    uuid: "type",
                  },
                ],
                treeId: "2",
                uuid: "machineName",
              },
              treePath: "/treeCatalog",
              type: "tree",
            },
            children: [],
            uuid: "treeCatalog",
          },
        ],
        uuid: "address",
      },
    ],
    uuid: "name",
  },
  tree: {
    attributes: {
      isLeaf: false,
      isRoot: true,
      label: "Name",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          isLeaf: false,
          isRoot: false,
          label: "Adresse",
          name: "address",
          type: "email",
        },
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "Tree Catalog",
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
                      isLeaf: false,
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
                    children: [
                      {
                        attributes: {
                          isLeaf: true,
                          label: "Contact conducteur",
                          name: "conductor",
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
                                  name: "username",
                                  type: "text",
                                },
                                children: [],
                                uuid: "password",
                              },
                            ],
                            treeId: "1",
                            uuid: "username",
                          },
                          treePath: "/treeCatalog/conductor",
                          type: "tree",
                        },
                        children: [],
                        uuid: "conductor",
                      },
                    ],
                    uuid: "type",
                  },
                ],
                treeId: "2",
                uuid: "machineName",
              },
              treePath: "/treeCatalog",
              type: "tree",
            },
            children: [],
            uuid: "treeCatalog",
          },
        ],
        uuid: "address",
      },
    ],
    uuid: "name",
  },
  treePath: "/treeCatalog/conductor",
  uuid: "password",
};

const updatedAndAddDecisionInFieldWithChildrenMock: Mock = {
  newChild: {
    attributes: {
      isDecision: true,
      isLeaf: false,
      isRoot: false,
      label: "Select",
      name: "select",
      type: "select",
    },
    children: [
      {
        attributes: {
          label: "A",
          name: "select:A",
          value: "A",
        },
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "FieldA",
              name: "fieldA",
              type: "text",
            },
            children: [],
            uuid: "fieldA",
          },
        ],
        uuid: "select:A",
      },
      {
        attributes: {
          label: "B",
          name: "select:B",
          value: "B",
        },
        children: [
          {
            attributes: {
              isLeaf: false,
              label: "FieldB",
              name: "fieldB",
              type: "text",
            },
            children: [
              {
                attributes: {
                  isLeaf: true,
                  label: "FieldB2",
                  name: "fieldB2",
                  type: "text",
                },
                children: [],
                uuid: "fieldB2",
              },
            ],
            uuid: "fieldB",
          },
        ],
        uuid: "select:B",
      },
      {
        attributes: {
          label: "C",
          name: "select:C",
          value: "C",
        },
        children: [
          {
            attributes: {
              isLeaf: true,
              label: "FieldC",
              name: "fieldC",
              type: "text",
            },
            children: [],
            uuid: "fieldC",
          },
        ],
        uuid: "select:C",
      },
      {
        attributes: {
          isLeaf: true,
          label: "D",
          name: "select:D",
          value: "D",
        },
        children: [],
        uuid: "select:D",
      },
    ],
    uuid: "select",
  },
  output: {
    attributes: {
      isLeaf: false,
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
          isRoot: false,
          label: "Select",
          name: "select",
          type: "select",
        },
        children: [
          {
            attributes: {
              label: "A",
              name: "select:A",
              value: "A",
            },
            children: [
              {
                attributes: {
                  isLeaf: true,
                  label: "FieldA",
                  name: "fieldA",
                  type: "text",
                },
                children: [],
                uuid: "fieldA",
              },
            ],
            uuid: "select:A",
          },
          {
            attributes: {
              label: "B",
              name: "select:B",
              value: "B",
            },
            children: [
              {
                attributes: {
                  isLeaf: false,
                  label: "FieldB",
                  name: "fieldB",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      isLeaf: true,
                      label: "FieldB2",
                      name: "fieldB2",
                      type: "text",
                    },
                    children: [],
                    uuid: "fieldB2",
                  },
                ],
                uuid: "fieldB",
              },
            ],
            uuid: "select:B",
          },
          {
            attributes: {
              label: "C",
              name: "select:C",
              value: "C",
            },
            children: [
              {
                attributes: {
                  isLeaf: true,
                  label: "FieldC",
                  name: "fieldC",
                  type: "text",
                },
                children: [],
                uuid: "fieldC",
              },
            ],
            uuid: "select:C",
          },
          {
            attributes: {
              isLeaf: true,
              label: "D",
              name: "select:D",
              value: "D",
            },
            children: [],
            uuid: "select:D",
          },
        ],
        uuid: "select",
      },
    ],
    uuid: "name",
  },
  tree: {
    attributes: {
      isLeaf: false,
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
          isRoot: false,
          label: "Select",
          name: "select",
          type: "select",
        },
        children: [
          {
            attributes: {
              isLeaf: false,
              label: "A",
              name: "select:A",
              value: "A",
            },
            children: [
              {
                attributes: {
                  isLeaf: true,
                  label: "FieldA",
                  name: "fieldA",
                  type: "text",
                },
                children: [],
                uuid: "fieldA",
              },
            ],
            uuid: "select:A",
          },
          {
            attributes: {
              isLeaf: false,
              label: "B",
              name: "select:B",
              value: "B",
            },
            children: [
              {
                attributes: {
                  isLeaf: false,
                  label: "FieldB",
                  name: "fieldB",
                  type: "text",
                },
                children: [
                  {
                    attributes: {
                      isLeaf: true,
                      label: "FieldB2",
                      name: "fieldB2",
                      type: "text",
                    },
                    children: [],
                    uuid: "fieldB2",
                  },
                ],
                uuid: "fieldB",
              },
            ],
            uuid: "select:B",
          },
          {
            attributes: {
              isLeaf: false,
              label: "C",
              name: "select:C",
              value: "C",
            },
            children: [
              {
                attributes: {
                  isLeaf: true,
                  label: "FieldC",
                  name: "fieldC",
                  type: "text",
                },
                children: [],
                uuid: "fieldC",
              },
            ],
            uuid: "select:C",
          },
        ],
        uuid: "select",
      },
    ],
    uuid: "name",
  },
  treePath: "",
  uuid: "select",
};

export {
  updatedFirstNodeInTreeMock,
  updatedNodeInOtherTreeMock,
  updatedTreeMock,
  updatedNodeInComplexeTreeMock,
  updatedAndAddDecisionInFieldWithChildrenMock,
};
