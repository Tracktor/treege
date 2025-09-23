import { CSSProperties } from "react";

const edgeConfig: Record<string, { style: CSSProperties; showDeleteButton?: boolean }> = {
  default: {
    showDeleteButton: true,
    style: {
      stroke: "#999",
      strokeDashoffset: 0,
      strokeWidth: 1,
    },
  },
  option: {
    showDeleteButton: false,
    style: {
      stroke: "#999",
      strokeDasharray: "3 3",
      strokeDashoffset: 0,
      strokeWidth: 1,
    },
  },
};

export default edgeConfig;
