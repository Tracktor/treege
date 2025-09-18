import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";
import { memo } from "react";

const DefaultEdge = (props: EdgeProps) => {
  const [path] = getStraightPath(props);

  return (
    <BaseEdge
      path={path}
      style={{
        stroke: "#999",
        strokeDashoffset: 0,
        strokeWidth: 1,
      }}
    />
  );
};

export default memo(DefaultEdge);
