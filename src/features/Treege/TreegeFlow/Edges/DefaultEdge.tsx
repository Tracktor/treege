import { BaseEdge, EdgeProps } from "@xyflow/react";
import { useMemo } from "react";

interface ElkPoint {
  x: number;
  y: number;
}

/**
 * Edge simple avec ligne droite entre source et target.
 * Si elkPoints est fourni (par getLayout), l’utilise,
 * sinon fallback sur les coordonnées actuelles.
 */
const DefaultEdge = ({ id, data, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  // on récupère elkPoints ou un fallback à 2 points
  const elkPoints: ElkPoint[] = (data?.elkPoints as ElkPoint[] | undefined) ?? [
    { x: sourceX, y: sourceY },
    { x: targetX, y: targetY },
  ];

  // on remplace le début et la fin par coords actuelles des nodes
  const points = useMemo(() => {
    if (elkPoints.length < 2) {
      return [
        { x: sourceX, y: sourceY },
        { x: targetX, y: targetY },
      ];
    }

    const copy = [...elkPoints];
    // impose les coordonnées actuelles (React Flow)
    copy[0] = { x: sourceX, y: sourceY };
    copy[copy.length - 1] = { x: targetX, y: targetY };
    return copy;
  }, [elkPoints, sourceX, sourceY, targetX, targetY]);

  // construit le path SVG — seulement deux points → ligne droite
  const d = useMemo(() => `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`, [points]);

  return (
    <BaseEdge
      id={id}
      path={d}
      style={{
        stroke: "#999",
        strokeWidth: 2,
      }}
    />
  );
};

export default DefaultEdge;
