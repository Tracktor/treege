import { keyframes } from "@tracktor/design-system";
import { BaseEdge, EdgeProps } from "@xyflow/react";

type ElkEdgeData = {
  elkPoints?: { x: number; y: number }[];
};

const dashAnim = keyframes`
  to {
    stroke-dashoffset: -12;
  }
`;

const OrthogonalEdge = ({ id, data, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const edgeData = data as ElkEdgeData | undefined;

  const elkPoints: { x: number; y: number }[] | undefined = edgeData?.elkPoints;

  const points: { x: number; y: number }[] =
    elkPoints && elkPoints.length > 0
      ? elkPoints
      : [
          { x: sourceX, y: sourceY },
          { x: targetX, y: targetY },
        ];

  const d = points.reduce((acc, point, index) => acc + (index === 0 ? `M${point.x},${point.y}` : ` L${point.x},${point.y}`), "");

  return (
    <BaseEdge
      id={id}
      path={d}
      style={{
        animation: `${dashAnim} 1s linear infinite`,
        fill: "none",
        stroke: "#999",
        strokeDasharray: "6 4",
        strokeDashoffset: 0,
        strokeWidth: 2,
      }}
    />
  );
};

export default OrthogonalEdge;
