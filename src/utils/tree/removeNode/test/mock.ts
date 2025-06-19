import type { TreeNode } from "@tracktor/types-treege";

type Mock = { tree: TreeNode; output: TreeNode; treePath: string; uuid: string };

const removeNodeInTreeMock: Mock = {
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
  treePath: "",
  uuid: "email",
};

const removeTreeInTreeMock: Mock = {
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
          label: "User Tree",
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
          treePath: "/userTree",
          type: "tree",
        },
        children: [],
        uuid: "userTree",
      },
    ],
    uuid: "username",
  },
  treePath: "",
  uuid: "userTree",
};

const removeDecisionInTreeMock: Mock = {
  output: {
    attributes: {
      depth: 0,
      isDecision: true,
      isLeaf: false,
      isRoot: true,
      label: "Decision field",
      name: "decisionField",
      type: "select",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "A",
          name: "decisionField:A",
          value: "A",
        },
        children: [],
        uuid: "decisionField:A",
      },
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "C",
          name: "decisionField:C",
          value: "C",
        },
        children: [],
        uuid: "decisionField:C",
      },
    ],
    uuid: "decisionField",
  },
  tree: {
    attributes: {
      depth: 0,
      isDecision: true,
      isLeaf: true,
      isRoot: true,
      label: "Decision field",
      name: "decisionField",
      type: "select",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "A",
          name: "decisionField:A",
          value: "A",
        },
        children: [],
        uuid: "decisionField:A",
      },
      {
        attributes: {
          depth: 1,
          isLeaf: false,
          label: "B",
          name: "decisionField:B",
          value: "B",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "FieldB",
              name: "fieldA",
              type: "text",
            },
            children: [],
            uuid: "fieldB",
          },
        ],
        uuid: "decisionField:B",
      },
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "C",
          name: "decisionField:C",
          value: "C",
        },
        children: [],
        uuid: "decisionField:C",
      },
    ],
    uuid: "decisionField",
  },
  treePath: "",
  uuid: "decisionField:B",
};

const removeDecisionFieldInTreeMock: Mock = {
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
          isDecision: true,
          isLeaf: false,
          isRoot: false,
          label: "DecisionField",
          name: "DecisionField",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "A",
              name: "select:A",
              value: "A",
            },
            children: [],
            uuid: "DecisionField:A",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "B",
              name: "select:B",
              value: "B",
            },
            children: [],
            uuid: "DecisionField:B",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "C",
              name: "select:C",
              value: "C",
            },
            children: [],
            uuid: "DecisionField:C",
          },
        ],
        uuid: "DecisionField",
      },
    ],
    uuid: "username",
  },
  treePath: "",
  uuid: "DecisionField",
};

const removeNodeWithAncestorReferencesMock: Mock = {
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "a",
      name: "a",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 2,
          isLeaf: true,
          label: "c",
          name: "c",
          type: "text",
        },
        children: [],
        uuid: "1750330116220babkh4p17458.099999964237",
      },
    ],
    uuid: "1750330099878oo8zrsr1116",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "a",
      name: "a",
      type: "text",
    },
    children: [
      {
        attributes: {
          defaultValueFromAncestor: {
            sourceValue: "staticValue",
            uuid: "1750330099878oo8zrsr1116",
          },
          depth: 1,
          isLeaf: false,
          label: "b",
          name: "b",
          type: "text",
        },
        children: [
          {
            attributes: {
              defaultValueFromAncestor: {
                sourceValue: "blabla",
                uuid: "1750330104325rew2ouz5563.300000011921",
              },
              depth: 2,
              isLeaf: true,
              label: "c",
              name: "c",
              type: "text",
            },
            children: [],
            uuid: "1750330116220babkh4p17458.099999964237",
          },
        ],
        uuid: "1750330104325rew2ouz5563.300000011921",
      },
    ],
    uuid: "1750330099878oo8zrsr1116",
  },
  treePath: "",
  uuid: "1750330104325rew2ouz5563.300000011921",
};

const removeNodeWithParamsAncestorReferencesMock: Mock = {
  output: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "a",
      name: "a",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 2,
          isLeaf: true,
          label: "c",
          name: "c",
          route: {
            params: [
              {
                id: "2",
                key: "keyB",
                staticValue: "staticValue",
              },
            ],
            url: "http://localhost:5173/",
          },
          type: "autocomplete",
        },
        children: [],
        uuid: "1750329316942903kq6m17973.69999998808",
      },
    ],
    uuid: "1750329307993cq2qtr39024",
  },
  tree: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "a",
      name: "a",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: false,
          label: "b",
          name: "b",
          type: "text",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "c",
              name: "c",
              route: {
                params: [
                  {
                    ancestorUuid: "175032931237694ccrne13407.699999988079",
                    id: "1",
                    key: "keyA",
                    useAncestorValue: true,
                  },
                  {
                    id: "2",
                    key: "keyB",
                    staticValue: "staticValue",
                  },
                ],
                url: "http://localhost:5173/",
              },
              type: "autocomplete",
            },
            children: [],
            uuid: "1750329316942903kq6m17973.69999998808",
          },
        ],
        uuid: "175032931237694ccrne13407.699999988079",
      },
    ],
    uuid: "1750329307993cq2qtr39024",
  },
  treePath: "",
  uuid: "175032931237694ccrne13407.699999988079",
};

export {
  removeNodeInTreeMock,
  removeTreeInTreeMock,
  removeDecisionInTreeMock,
  removeDecisionFieldInTreeMock,
  removeNodeWithAncestorReferencesMock,
  removeNodeWithParamsAncestorReferencesMock,
};
