import colors from "@/constants/colors";
import { TreeNodeData } from "@/features/Treege/TreegeFlow/utils/types";

interface NodeConfig {
  chipLabel: string;
  borderColor: string;
  showAddButton?: (data: TreeNodeData) => boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

const defaultRender: NodeConfig = {
  borderColor: colors.primary,
  chipLabel: "default",
  showAddButton: () => true,
  showDeleteButton: true,
  showEditButton: true,
};

const nodeConfigByCategory = {
  boolean: {
    checkbox: { ...defaultRender, chipLabel: "checkbox" },
    switch: { ...defaultRender, chipLabel: "switch" },
  },
  dateTime: {
    date: { ...defaultRender, chipLabel: "date" },
    dateRange: { ...defaultRender, chipLabel: "dateRange" },
    time: { ...defaultRender, chipLabel: "time" },
    timeRange: { ...defaultRender, chipLabel: "timeRange" },
  },
  decision: {
    option: {
      ...defaultRender,
      borderColor: colors.secondary,
      chipLabel: "option",
      showDeleteButton: false,
      showEditButton: false,
    },
    radio: {
      ...defaultRender,
      chipLabel: "radio",
      showAddButton: () => false,
    },
    select: {
      ...defaultRender,
      chipLabel: "select",
      showAddButton: () => false,
    },
  },
  other: {
    autocomplete: {
      ...defaultRender,
      borderColor: colors.secondary,
      chipLabel: "api",
    },
    dynamicSelect: { ...defaultRender, chipLabel: "api" },
    file: { ...defaultRender, chipLabel: "file" },
    hidden: { ...defaultRender, chipLabel: "hidden" },
    title: { ...defaultRender, chipLabel: "title" },
  },
  textArea: {
    address: { ...defaultRender, chipLabel: "address" },
    email: { ...defaultRender, chipLabel: "email" },
    number: { ...defaultRender, chipLabel: "number" },
    password: { ...defaultRender, chipLabel: "password" },
    tel: { ...defaultRender, chipLabel: "tel" },
    text: { ...defaultRender, chipLabel: "text" },
    url: { ...defaultRender, chipLabel: "url" },
  },
};

const nodeConfig: Record<string, NodeConfig> = Object.values(nodeConfigByCategory).reduce((acc, group) => ({ ...acc, ...group }), {});

const isNodeType = (key: unknown): key is keyof typeof nodeConfig => typeof key === "string" && key in nodeConfig;

export { nodeConfig, isNodeType, type NodeConfig };
