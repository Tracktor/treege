import type { TreeNode } from "@/features/Treege/type/TreeNode";

type Mock = { input: TreeNode; output: string[] };

export const treeWithOneTag: Mock = {
  input: {
    attributes: {
      isLeaf: true,
      isRoot: true,
      label: "Name",
      name: "name",
      tag: "tag-name",
      type: "text",
    },
    children: [],
    uuid: "name",
  },
  output: ["tag-name"],
};

export const treeWithMultiSameTag: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "Name",
      name: "name",
      tag: "tag",
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
              name: "age",
              tag: "tag",
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
  output: ["tag"],
};

export const treeWithMultiTag: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "Name",
      name: "name",
      tag: "tag-name",
      type: "text",
    },
    children: [
      {
        attributes: {
          label: "Age",
          name: "age",
          tag: "tag-age",
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
                      name: "carrycot_type",
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
                    uuid: "carrycot_type",
                  },
                ],
                uuid: "materials:carrycot",
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
  output: ["tag-age", "tag-name"],
};

export const treeWithMultiAndSameTag: Mock = {
  input: {
    attributes: {
      isRoot: true,
      label: "Nom",
      name: "name",
      tag: "tag-1",
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
              tag: "tag-2",
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
                      name: "carrycot_type:carrycot_8",
                      value: "carrycot_8",
                    },
                    children: [],
                    uuid: "carrycot_type:carrycot_8",
                  },
                  {
                    attributes: {
                      label: "Nacelle 10m",
                      name: "carrycot_type:carrycot_10",
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
                      name: "carrycot_type:carrycot_20",
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
  output: ["tag-1", "tag-2"],
};
