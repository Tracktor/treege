import { keyframes } from "@tracktor/design-system";
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";
import React from "react";

const dashAnim = keyframes`
  to {
    stroke-dashoffset: -10;
  }
`;

const AnimatedDashedEdge = (props: EdgeProps) => {
  const [path] = getBezierPath(props);

  return (
    <BaseEdge
      path={path}
      style={{
        animation: `${dashAnim} 1s linear infinite`,
        stroke: "#999",
        strokeDasharray: "5 5",
        strokeDashoffset: 0,
        strokeWidth: 2,
      }}
    />
  );
};

export default AnimatedDashedEdge;
