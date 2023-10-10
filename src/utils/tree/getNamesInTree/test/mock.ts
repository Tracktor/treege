import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: string[] };

export const treeWithOneField: Mock = {
  input: {
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
  output: ["name"].sort(),
};

export const treeWithMultiFields: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          label: "Age",
          type: "number",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isLeaf: true,
              label: "Sexe",
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
            name: "gender",
          },
        ],
        name: "age",
      },
    ],
    name: "name",
  },
  output: ["name", "age", "gender"].sort(),
};

export const treeWithDecisionFields: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Name",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          label: "Age",
          type: "number",
        },
        children: [
          {
            attributes: {
              depth: 2,
              isDecision: true,
              isLeaf: false,
              label: "Matériels",
              type: "select",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  label: "Mini-pelle",
                  value: "mini_excavator",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "Type",
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
                    name: "mini_excavator_type",
                  },
                ],
                name: "materials:mini_excavator",
              },
              {
                attributes: {
                  depth: 3,
                  label: "Nacelle",
                  value: "carrycot",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "Type",
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
                    name: "carrycot_type",
                  },
                ],
                name: "materials:carrycot",
              },
            ],
            name: "materials",
          },
        ],
        name: "age",
      },
    ],
    name: "name",
  },
  output: ["name", "age", "mini_excavator_type", "carrycot_type", "materials:carrycot", "materials:mini_excavator", "materials"].sort(),
};

export const complexeTreeWithMultiDecisionFields: Mock = {
  input: {
    attributes: {
      depth: 0,
      isRoot: true,
      label: "Nom",
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          isDecision: true,
          label: "Matériels",
          type: "select",
        },
        children: [
          {
            attributes: {
              depth: 2,
              label: "Mini-pelle",
              value: "mini_excavator",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isLeaf: true,
                  label: "Type",
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
                name: "mini_excavator_type",
              },
            ],
            name: "materials:mini_excavator",
          },
          {
            attributes: {
              depth: 2,
              label: "Nacelle",
              value: "carrycot",
            },
            children: [
              {
                attributes: {
                  depth: 3,
                  isDecision: true,
                  label: "Type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
                      depth: 4,
                      isLeaf: true,
                      label: "Nacelle 8m",
                      value: "carrycot_8",
                    },
                    children: [],
                    name: "carrycot_type:carrycot_8",
                  },
                  {
                    attributes: {
                      depth: 4,
                      label: "Nacelle 10m",
                      value: "carrycot_10",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 5,
                          isLeaf: true,
                          label: "Permission",
                          type: "text",
                        },
                        children: [],
                        name: "carrycot_10_permission",
                      },
                    ],
                    name: "carrycot_type:carrycot_10",
                  },
                  {
                    attributes: {
                      depth: 4,
                      label: "Nacelle 20m",
                      value: "carrycot_20",
                    },
                    children: [
                      {
                        attributes: {
                          depth: 5,
                          isLeaf: true,
                          label: "Permission",
                          type: "text",
                        },
                        children: [],
                        name: "carrycot_20_permission",
                      },
                    ],
                    name: "carrycot_type:carrycot_20",
                  },
                ],
                name: "carrycot_type",
              },
            ],
            name: "materials:carrycot",
          },
        ],
        name: "materials",
      },
    ],
    name: "name",
  },
  output: [
    "name",
    "mini_excavator_type",
    "carrycot_10_permission",
    "carrycot_20_permission",
    "materials:carrycot",
    "materials:mini_excavator",
    "carrycot_type:carrycot_10",
    "carrycot_type:carrycot_20",
    "carrycot_type:carrycot_8",
    "carrycot_type",
    "materials",
  ].sort(),
};

export const treeWithTree: Mock = {
  input: {
    attributes: {
      depth: 0,
      isLeaf: true,
      isRoot: true,
      label: "Name",
      tree: {
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
              label: "Name",
              type: "text",
            },
            children: [],
            name: "nameInTree",
          },
        ],
        name: "nameInTree",
      },
      type: "text",
    },
    children: [],
    name: "name",
  },
  output: ["name"].sort(),
};
