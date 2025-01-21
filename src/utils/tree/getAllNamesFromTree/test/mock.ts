import { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: string[] };

export const treeWithOneField: Mock = {
  input: {
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
  output: ["name"].sort(),
};

export const treeWithMultiFields: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "Name",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          label: "Age",
          name: "age",
          type: "number",
        },
        children: [
          {
            attributes: {
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
      isRoot: true,
      label: "Name",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          label: "Age",
          name: "age",
          type: "number",
        },
        children: [
          {
            attributes: {
              isDecision: true,
              isLeaf: false,
              label: "Matériels",
              name: "materials",
              type: "select",
            },
            children: [
              {
                attributes: {
                  label: "Mini-pelle",
                  name: "materials:mini_excavator",
                  value: "mini_excavator",
                },
                children: [
                  {
                    attributes: {
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
                  label: "Nacelle",
                  name: "materials:carrycot",
                  value: "carrycot",
                },
                children: [
                  {
                    attributes: {
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
      isRoot: true,
      label: "Nom",
      name: "name",
      type: "text",
    },
    children: [
      {
        attributes: {
          isDecision: true,
          label: "Matériels",
          name: "materials",
          type: "select",
        },
        children: [
          {
            attributes: {
              label: "Mini-pelle",
              name: "materials:mini_excavator",
              value: "mini_excavator",
            },
            children: [
              {
                attributes: {
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
              label: "Nacelle",
              name: "materials:carrycot",
              value: "carrycot",
            },
            children: [
              {
                attributes: {
                  isDecision: true,
                  label: "Type",
                  name: "carrycot_type",
                  type: "select",
                },
                children: [
                  {
                    attributes: {
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
                      label: "Nacelle 10m",
                      name: "carrycot_10",
                      value: "carrycot_10",
                    },
                    children: [
                      {
                        attributes: {
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
                      label: "Nacelle 20m",
                      name: "carrycot_20",
                      value: "carrycot_20",
                    },
                    children: [
                      {
                        attributes: {
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
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "name",
      tree: {
        attributes: {
          isLeaf: true,
          isRoot: true,
          label: "Name",
          name: "nameInTree",
          type: "text",
        },
        children: [
          {
            attributes: {
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
