import { keyframes } from "@tracktor/design-system";
import { BaseEdge, EdgeProps } from "@xyflow/react";
import { useMemo } from "react";

interface ElkPoint {
  x: number;
  y: number;
}

// Animation dash
const dashAnim = keyframes`
    from {
        stroke-dashoffset: 0;
    }
    to {
        stroke-dashoffset: -12;
    }
`;

/**
 * Edge orthogonal animé avec elkPoints de ELK layout.
 * Ajuste automatiquement début et fin aux coordonnées actuelles des nodes.
 */
const OrthogonalEdge = ({ id, data, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  // on récupère elkPoints ou un fallback
  const elkPoints: ElkPoint[] = (data?.elkPoints as ElkPoint[] | undefined) ?? [
    { x: sourceX, y: sourceY },
    { x: targetX, y: targetY },
  ];

  // on remplace début et fin par coords actuelles des nodes
  const points = useMemo(() => {
    if (elkPoints.length < 2) {
      return [
        { x: sourceX, y: sourceY },
        { x: targetX, y: targetY },
      ];
    }
    const copy = [...elkPoints];
    copy[0] = { x: sourceX, y: sourceY };
    copy[copy.length - 1] = { x: targetX, y: targetY };
    return copy;
  }, [elkPoints, sourceX, sourceY, targetX, targetY]);

  // construit le path SVG
  const d = useMemo(() => `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`, [points]);

  return (
    <BaseEdge
      id={id}
      path={d}
      style={{
        animation: `${dashAnim} 1s linear infinite`,
        stroke: "#999",
        strokeDasharray: "6 4",
        strokeWidth: 2,
      }}
    />
  );
};

export default OrthogonalEdge;
