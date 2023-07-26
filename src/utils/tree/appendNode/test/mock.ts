import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { tree: TreeNode | null; output: TreeNode; treePath: string | null; newChild: TreeNode; name: string };

const addFirstNodeInTreeMock: Mock = {
  name: "",
  newChild: {
    attributes: {
      depth: 0,
      label: "Username",
      type: "text",
    },
    children: [],
    name: "username",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Username",
      type: "text",
    },
    children: [],
    name: "username",
  },
  tree: null,
  treePath: "",
};

const initialiseTree: Mock = {
  name: "",
  newChild: {
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
          label: "Email",
          type: "email",
        },
        children: [],
        name: "email",
      },
    ],
    name: "username",
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
          label: "Email",
          type: "email",
        },
        children: [],
        name: "email",
      },
    ],
    name: "username",
  },
  tree: null,
  treePath: "",
};

const addNodeInTreeMock: Mock = {
  name: "username",
  newChild: {
    attributes: {
      depth: 1,
      label: "Email",
      type: "email",
    },
    children: [],
    name: "email",
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
          label: "Email",
          type: "email",
        },
        children: [],
        name: "email",
      },
    ],
    name: "username",
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
    name: "username",
  },
  treePath: "",
};

const addNodeOtherTreeMock: Mock = {
  name: "userName",
  newChild: {
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
          isDecision: true,
          isLeaf: false,
          isRoot: false,
          label: "Type",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Mini-pelle",
              value: "minipelle",
            },
            children: [],
            name: "type:minipelle",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Nacelle",
              value: "nacelle",
            },
            children: [],
            name: "type:nacelle",
          },
        ],
        name: "type",
      },
    ],
    name: "machineName",
    treeId: "2",
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
                  isDecision: true,
                  isLeaf: false,
                  isRoot: false,
                  label: "Type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Mini-pelle",
                      value: "minipelle",
                    },
                    children: [],
                    name: "type:minipelle",
                  },
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Nacelle",
                      value: "nacelle",
                    },
                    children: [],
                    name: "type:nacelle",
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
                  isDecision: true,
                  isLeaf: false,
                  isRoot: false,
                  label: "Type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Mini-pelle",
                      value: "minipelle",
                    },
                    children: [],
                    name: "type:minipelle",
                  },
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Nacelle",
                      value: "nacelle",
                    },
                    children: [],
                    name: "type:nacelle",
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
    name: "userName",
  },
  treePath: "/treeCatalog",
};

const addNodeDecisionInOtherTreeMock: Mock = {
  name: "type",
  newChild: {
    attributes: {
      depth: 2,
      label: "Prix",
      type: "number",
    },
    children: [],
    name: "price",
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
                      label: "Prix",
                      type: "number",
                    },
                    children: [],
                    name: "price",
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

const addTreeNodeMock: Mock = {
  name: "userName",
  newChild: {
    attributes: {
      depth: 1,
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

const addNodeBetweenNodes: Mock = {
  name: "username",
  newChild: { attributes: { depth: 1, label: "Email", type: "email" }, children: [], name: "email" },
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
          isLeaf: false,
          label: "Email",
          type: "email",
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
        name: "email",
      },
    ],
    name: "username",
  },
  tree: {
    attributes: { depth: 0, isLeaf: false, isRoot: true, label: "Username", type: "text" },
    children: [{ attributes: { depth: 1, isLeaf: true, label: "Password", type: "text" }, children: [], name: "password" }],
    name: "username",
  },
  treePath: null,
};

export {
  addNodeBetweenNodes,
  addFirstNodeInTreeMock,
  addNodeInTreeMock,
  addNodeOtherTreeMock,
  addNodeDecisionInOtherTreeMock,
  addTreeNodeMock,
  initialiseTree,
};
