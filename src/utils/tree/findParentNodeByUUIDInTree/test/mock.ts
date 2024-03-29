import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: TreeNode | null; name: string };

const simpleTreeMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "email",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 0,
          isLeaf: true,
          isRoot: true,
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [],
        uuid: "email",
      },
    ],
    uuid: "name",
  },
  name: "email",
  output: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "email",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 0,
          isLeaf: true,
          isRoot: true,
          label: "Email",
          name: "email",
          type: "email",
        },
        children: [],
        uuid: "email",
      },
    ],
    uuid: "name",
  },
};

const treeInTreeMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Name",
      name: "userTree",
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
              depth: 2,
              isLeaf: true,
              label: "UserTree",
              name: "userTree",
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
        uuid: "email",
      },
    ],
    uuid: "name",
  },
  name: "userTree",
  output: {
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
          depth: 2,
          isLeaf: true,
          label: "UserTree",
          name: "userTree",
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
    uuid: "email",
  },
};

const treeInTreeNoNameMock: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: false,
      isRoot: true,
      label: "Name",
      name: "noname",
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
              depth: 2,
              isLeaf: true,
              label: "UserTree",
              name: "userTree",
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
        uuid: "email",
      },
    ],
    uuid: "name",
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
      name: "password",
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
              depth: 2,
              isLeaf: true,
              label: "UserTree",
              name: "userTree",
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
        uuid: "email",
      },
    ],
    uuid: "name",
  },
  name: "password",
  output: null,
};

export { simpleTreeMock, treeInTreeMock, treeInTreeNoNameMock, searchNameInOtherTreeMock };
