import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";
import { memo } from "react";

const OptionEdge = (props: EdgeProps) => {
  const [path] = getStraightPath(props);

  return (
    <BaseEdge
      path={path}
      style={{
        stroke: "#999",
        strokeDasharray: "3 3",
        strokeDashoffset: 0,
        strokeWidth: 1,
      }}
    />
  );
};

export default memo(OptionEdge);
