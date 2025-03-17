import type { TreeNode } from "@tracktor/types-treege";

type Mock = { tree: TreeNode | null; output: TreeNode; treePath: string | null; newChild: TreeNode; uuid: string };

const addFirstNodeInTreeMock: Mock = {
  newChild: {
    attributes: {
      depth: 0,
      label: "Username",
      name: "username",
      type: "text",
    },
    children: [],
    uuid: "username",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Username",
      name: "username",
      type: "text",
    },
    children: [],
    uuid: "username",
  },
  tree: null,
  treePath: "",
  uuid: "",
};

const initialiseTree: Mock = {
  newChild: {
    attributes: {
      depth: 0,
      isLeaf: false,
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
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [],
        uuid: "email",
      },
    ],
    uuid: "username",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
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
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [],
        uuid: "email",
      },
    ],
    uuid: "username",
  },
  tree: null,
  treePath: "",
  uuid: "",
};

const addNodeInTreeMock: Mock = {
  newChild: {
    attributes: {
      depth: 1,
      label: "Email",
      name: "email",
      type: "email",
    },
    children: [],
    uuid: "email",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
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
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [],
        uuid: "email",
      },
    ],
    uuid: "username",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Username",
      name: "username",
      type: "text",
    },
    children: [],
    uuid: "username",
  },
  treePath: "",
  uuid: "username",
};

const addNodeOtherTreeMock: Mock = {
  newChild: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Nom de la machine",
      name: "treeCatalog",
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
          name: "machineName",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Mini-pelle",
              name: "machineName:minipelle",
              value: "minipelle",
            },
            children: [],
            uuid: "type:minipelle",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Nacelle",
              name: "machineName:nacelle",
              value: "nacelle",
            },
            children: [],
            uuid: "type:nacelle",
          },
        ],
        uuid: "type",
      },
    ],
    treeId: "2",
    uuid: "machineName",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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
                  isDecision: true,
                  isLeaf: false,
                  isRoot: false,
                  label: "Type",
                  name: "type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Mini-pelle",
                      name: "type:minipelle",
                      value: "minipelle",
                    },
                    children: [],
                    uuid: "type:minipelle",
                  },
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Nacelle",
                      name: "type:nacelle",
                      value: "nacelle",
                    },
                    children: [],
                    uuid: "type:nacelle",
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
    uuid: "userName",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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
                  isDecision: true,
                  isLeaf: false,
                  isRoot: false,
                  label: "Type",
                  name: "type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Mini-pelle",
                      name: "type:minipelle",
                      value: "minipelle",
                    },
                    children: [],
                    uuid: "type:minipelle",
                  },
                  {
                    attributes: {
                      depth: 2,
                      isLeaf: true,
                      label: "Nacelle",
                      name: "type:nacelle",
                      value: "nacelle",
                    },
                    children: [],
                    uuid: "type:nacelle",
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
    uuid: "userName",
  },
  treePath: "/treeCatalog",
  uuid: "userName",
};

const addNodeDecisionInOtherTreeMock: Mock = {
  newChild: {
    attributes: {
      depth: 2,
      label: "Prix",
      name: "price",
      type: "number",
    },
    children: [],
    uuid: "price",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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
                      depth: 2,
                      isLeaf: true,
                      label: "Prix",
                      name: "price",
                      type: "number",
                    },
                    children: [],
                    uuid: "price",
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
    uuid: "userName",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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

const addTreeNodeMock: Mock = {
  newChild: {
    attributes: {
      depth: 1,
      label: "Tree Catalog",
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
        treeId: "2",
        uuid: "machineName",
      },
      treePath: "/treeCatalog",
      type: "tree",
    },
    children: [],
    uuid: "treeCatalog",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "userName",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "Tree Catalog",
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
      depth: 0,
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

const addNodeBetweenNodes: Mock = {
  newChild: {
    attributes: {
      depth: 1,
      label: "Email",
      name: "email",
      type: "email",
    },
    children: [],
    uuid: "email",
  },
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Username",
      name: "username",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: false,
          label: "Email",
          name: "email",
          type: "email",
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
        uuid: "email",
      },
    ],
    uuid: "username",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
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
  treePath: null,
  uuid: "username",
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
