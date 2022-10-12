import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { tree: TreeNode; output: TreeNode; treePath: string; name: string };

const removeNodeInTreeMock: Mock = {
  name: "email",
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
          label: "Email",
          type: "text",
        },
        children: [],
        name: "email",
      },
    ],
    name: "username",
  },
  treePath: "",
};

const removeTreeInTreeMock: Mock = {
  name: "userTree",
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
          label: "User Tree",
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
          treePath: "/userTree",
          type: "tree",
        },
        children: [],
        name: "userTree",
      },
    ],
    name: "username",
  },
  treePath: "",
};

const removeDecisionInTreeMock: Mock = {
  name: "decisionField:B",
  output: {
    attributes: {
      depth: 0,
      isDecision: true,
      isLeaf: true,
      isRoot: true,
      label: "Decision field",
      type: "select",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "A",
          value: "A",
        },
        children: [],
        name: "decisionField:A",
      },
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "C",
          value: "C",
        },
        children: [],
        name: "decisionField:C",
      },
    ],
    name: "decisionField",
  },
  tree: {
    attributes: {
      depth: 0,
      isDecision: true,
      isLeaf: true,
      isRoot: true,
      label: "Decision field",
      type: "select",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "A",
          value: "A",
        },
        children: [],
        name: "decisionField:A",
      },
      {
        attributes: {
          depth: 1,
          isLeaf: false,
          label: "B",
          value: "B",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "FieldB",
              type: "text",
            },
            children: [],
            name: "fieldB",
          },
        ],
        name: "decisionField:B",
      },
      {
        attributes: {
          depth: 1,
          isLeaf: true,
          label: "C",
          value: "C",
        },
        children: [],
        name: "decisionField:C",
      },
    ],
    name: "decisionField",
  },
  treePath: "",
};

const removeDecisionFieldInTreeMock: Mock = {
  name: "DecisionField",
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
          isDecision: true,
          isLeaf: false,
          isRoot: false,
          label: "DecisionField",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "A",
              value: "A",
            },
            children: [],
            name: "DecisionField:A",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "B",
              value: "B",
            },
            children: [],
            name: "DecisionField:B",
          },
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "C",
              value: "C",
            },
            children: [],
            name: "DecisionField:C",
          },
        ],
        name: "DecisionField",
      },
    ],
    name: "username",
  },
  treePath: "",
};

export { removeNodeInTreeMock, removeTreeInTreeMock, removeDecisionInTreeMock, removeDecisionFieldInTreeMock };
