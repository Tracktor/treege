import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from "@xyflow/react";
import { Waypoints } from "lucide-react";
import { MouseEvent } from "react";
import { Button } from "@/components/ui/button";

const ConditionalEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style }: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  });

  const onEdgeClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  console.log(id);

  return (
    <>
      {/* Edge */}
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

      {/* Render button */}
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button variant="secondary" size="icon" className="size-8" onClick={onEdgeClick}>
            <Waypoints />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
export default ConditionalEdge;
