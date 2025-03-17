import type { TreeNode } from "@tracktor/types-treege";

type Mock = { input: TreeNode; output: string[] };

export const treeWithOneField: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "name",
      type: "text",
    },
    children: [],
    uuid: "name",
  },
  output: ["name"].sort(),
};

export const treeWithMultiFields: Mock = {
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
          label: "Age",
          name: "age",
          type: "number",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Sexe",
              name: "gender",
              type: "select",
              values: [
                {
                  id: "0",
                  label: "Homme",
                  value: "male",
                },
                {
                  id: "1",
                  label: "Femme",
                  value: "female",
                },
              ],
            },
            children: [],
            uuid: "gender",
          },
        ],
        uuid: "age",
      },
    ],
    uuid: "name",
  },
  output: ["name", "age", "gender"].sort(),
};

export const treeWithDecisionFields: Mock = {
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
          label: "Age",
          name: "age",
          type: "number",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isDecision: true,
              isLeaf: false,
              label: "Matériels",
              name: "materials",
              type: "select",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  label: "Mini-pelle",
                  name: "materials:mini_excavator",
                  value: "mini_excavator",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "Type",
                      name: "mini_excavator_type",
                      type: "select",
                      values: [
                        {
                          id: "0",
                          label: "Micro-Pelle 800kg",
                          value: "mini_excavator_800_kg",
                        },
                        {
                          id: "1",
                          label: "Mini-Pelle 1,5T",
                          value: "mini_excavator_1.5_t",
                        },
                      ],
                    },
                    children: [],
                    uuid: "mini_excavator_type",
                  },
                ],
                uuid: "materials:mini_excavator",
              },
              {
                attributes: {
                  depth: 3,
                  label: "Nacelle",
                  name: "materials:carrycot",
                  value: "carrycot",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "Type",
                      name: "materials:carrycot",
                      type: "select",
                      values: [
                        {
                          id: "0",
                          label: "Nacelle 8m",
                          value: "carrycot_8",
                        },
                        {
                          id: "1",
                          label: "Nacelle 10m",
                          value: "carrycot_10",
                        },
                      ],
                    },
                    children: [],
                    uuid: 'materials:carrycot"',
                  },
                ],
                uuid: "carrycot_type",
              },
            ],
            uuid: "materials",
          },
        ],
        uuid: "age",
      },
    ],
    uuid: "name",
  },
  output: ["age", "materials", "materials:carrycot", "materials:mini_excavator", "mini_excavator_type", "name"],
};

export const complexeTreeWithMultiDecisionFields: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Nom",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isDecision: true,
          label: "Matériels",
          name: "materials",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              label: "Mini-pelle",
              name: "materials:mini_excavator",
              value: "mini_excavator",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "Type",
                  name: "mini_excavator_type",
                  type: "select",
                  values: [
                    {
                      id: "0",
                      label: "Micro-Pelle 800kg",
                      value: "mini_excavator_800_kg",
                    },
                    {
                      id: "1",
                      label: "Micro-Pelle 1T",
                      value: "mini_excavator_1000_kg",
                    },
                  ],
                },
                children: [],
                uuid: "mini_excavator_type",
              },
            ],
            uuid: "materials:mini_excavator",
          },
          {
            attributes: {
              depth: 2,
              label: "Nacelle",
              name: "materials:carrycot",
              value: "carrycot",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isDecision: true,
                  label: "Type",
                  name: "carrycot_type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "Nacelle 8m",
                      name: "carrycot_8",
                      value: "carrycot_8",
                    },
                    children: [],
                    uuid: "carrycot_type:carrycot_8",
                  },
                  {
                    attributes: {
                      depth: 4,
                      label: "Nacelle 10m",
                      name: "carrycot_10",
                      value: "carrycot_10",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 5,
                          isLeaf: true,
                          label: "Permission",
                          name: "carrycot_10_permission",
                          type: "text",
                        },
                        children: [],
                        uuid: "carrycot_10_permission",
                      },
                    ],
                    uuid: "carrycot_type:carrycot_10",
                  },
                  {
                    attributes: {
                      depth: 4,
                      label: "Nacelle 20m",
                      name: "carrycot_20",
                      value: "carrycot_20",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 5,
                          isLeaf: true,
                          label: "Permission",
                          name: "carrycot_20_permission",
                          type: "text",
                        },
                        children: [],
                        uuid: "carrycot_20_permission",
                      },
                    ],
                    uuid: "carrycot_type:carrycot_20",
                  },
                ],
                uuid: "carrycot_type",
              },
            ],
            uuid: "materials:carrycot",
          },
        ],
        uuid: "materials",
      },
    ],
    uuid: "name",
  },
  output: [
    "carrycot_10",
    "carrycot_10_permission",
    "carrycot_20",
    "carrycot_20_permission",
    "carrycot_8",
    "carrycot_type",
    "materials",
    "materials:carrycot",
    "materials:mini_excavator",
    "mini_excavator_type",
    "name",
  ],
};

export const treeWithTree: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "name",
      tree: {
        attributes: {
          depth: 0,
          isLeaf: true,
          isRoot: true,
          label: "Name",
          name: "nameInTree",
          type: "text",
        },
        children: [
          {
            attributes: {
              depth: 0,
              isLeaf: true,
              isRoot: true,
              label: "Name",
              name: "nameInTree",
              type: "text",
            },
            children: [],
            uuid: "nameInTree",
          },
        ],
        uuid: "nameInTree",
      },
      type: "text",
    },
    children: [],
    uuid: "name",
  },
  output: ["name"].sort(),
};
