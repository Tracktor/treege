import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";
import { CSSProperties, memo } from "react";

type ExtendedEdgeProps = EdgeProps & { type?: string };

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

const EdgeFactory = ({ type, ...props }: ExtendedEdgeProps) => {
  const [path] = getStraightPath(props);

  const style = edgeConfig[type ?? "default"] ?? edgeConfig.default;

  return <BaseEdge path={path} style={style} />;
};

export default memo(EdgeFactory);
