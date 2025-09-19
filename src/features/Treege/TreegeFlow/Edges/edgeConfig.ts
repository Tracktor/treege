import { CSSProperties } from "react";

const edgeConfig: Record<string, CSSProperties> = {
  default: {
    stroke: "#999",
    strokeDashoffset: 0,
    strokeWidth: 1,
  },
  option: {
    stroke: "#999",
    strokeDasharray: "3 3",
    strokeDashoffset: 0,
    strokeWidth: 1,
  },
};

export default edgeConfig;
