import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode | null; name: string };

const simpleTreeMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
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
    ],
    name: "name",
  },
  name: "email",
  output: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
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
    ],
    name: "name",
  },
};

const treeInTreeMock: Mock = {
  input: {
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
          label: "Email",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "UserTree",
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
        name: "email",
      },
    ],
    name: "name",
  },
  name: "userTree",
  output: {
    attributes: {
      depth: 1,
      isLeaf: false,
      label: "Email",
      type: "email",
    },
    children: [
      {
        attributes: {
          depth: 2,
          isLeaf: true,
          label: "UserTree",
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
    name: "email",
  },
};

const treeInTreeNoNameMock: Mock = {
  input: {
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
          label: "Email",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "UserTree",
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
        name: "email",
      },
    ],
    name: "name",
  },
  name: "noname",
  output: null,
};

const searchNameInOtherTreeMock: Mock = {
  input: {
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
          label: "Email",
          type: "email",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "UserTree",
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
        name: "email",
      },
    ],
    name: "name",
  },
  name: "password",
  output: null,
};

export { simpleTreeMock, treeInTreeMock, treeInTreeNoNameMock, searchNameInOtherTreeMock };
