import { keyframes } from "@tracktor/design-system";
import { BaseEdge, EdgeProps } from "@xyflow/react";

interface ElkPoint {
  x: number;
  y: number;
}

// Animation dash
const dashAnim = keyframes`
    to {
        stroke-dashoffset: -12;
    }
`;

/**
 * Edge orthogonal animated with elkPoints from ELK layout
 */
const OrthogonalEdge = ({ id, data, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const elkPoints = (data?.elkPoints as ElkPoint[] | undefined) ?? [
    { x: sourceX, y: sourceY },
    { x: targetX, y: targetY },
  ];

  const d = elkPoints.reduce((acc, point, index) => acc + (index === 0 ? `M${point.x},${point.y}` : ` L${point.x},${point.y}`), "");

  return (
    <BaseEdge
      id={id}
      path={d}
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

export default OrthogonalEdge;
