import { keyframes } from "@tracktor/design-system";
import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";

const dashAnim = keyframes`
    to {
        stroke-dashoffset: -12;
    }
`;

const OptionEdge = (props: EdgeProps) => {
  const [path] = getStraightPath(props);

  return (
    <BaseEdge
      path={path}
      style={{
        animation: `${dashAnim} 1s linear infinite`,
        stroke: "#999",
        strokeDasharray: "6 4",
        strokeDashoffset: 0,
        strokeWidth: 2,
      }}
    />
  );
};

export default OptionEdge;
