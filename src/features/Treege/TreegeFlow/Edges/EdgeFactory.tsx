import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";
import { memo } from "react";
import edgeConfig from "@/features/Treege/TreegeFlow/Edges/edgeConfig";

type ExtendedEdgeProps = EdgeProps & { type?: string };

const EdgeFactory = ({ type, ...props }: ExtendedEdgeProps) => {
  const [path] = getStraightPath(props);

  const style = edgeConfig[type ?? "default"] ?? edgeConfig.default;

  return <BaseEdge path={path} style={style} />;
};

export default memo(EdgeFactory);
