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

export { removeNodeInTreeMock, removeTreeInTreeMock, removeDecisionInTreeMock, removeDecisionFieldInTreeMock };
