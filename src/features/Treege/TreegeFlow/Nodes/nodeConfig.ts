import colors from "@/constants/colors";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/utils/types";

interface NodeConfig {
  chipLabel: string;
  borderColor: string;
  showAddButton?: (data: CustomNodeData) => boolean;
}

const nodeConfig: Record<string, NodeConfig> = {
  boolean: {
    borderColor: colors.primary,
    chipLabel: "boolean",
    showAddButton: (data) => !data.isDecision,
  },
  option: {
    borderColor: colors.secondary,
    chipLabel: "option",
    showAddButton: () => true,
  },
  text: {
    borderColor: colors.primary,
    chipLabel: "text",
    showAddButton: () => true,
  },
};

export default nodeConfig;
