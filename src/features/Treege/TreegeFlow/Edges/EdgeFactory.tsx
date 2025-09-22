import { Button, Box } from "@tracktor/design-system";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from "@xyflow/react";
import { CSSProperties, memo } from "react";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

type ExtendedEdgeProps = EdgeProps & { type?: string };

const edgeConfig: Record<string, CSSProperties> = {
  default: {
    stroke: "#999",
    strokeDashoffset: 0,
    strokeWidth: 1,
  },
  option: {
    stroke: "#999",
    strokeDasharray: "3 3",
    strokeDashoffset: 0,
    strokeWidth: 1,
  },
};

const EdgeFactory = ({ id, type, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd }: ExtendedEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  });

  const { setEdges } = useReactFlow();
  const { deleteEdge } = useTreegeFlowContext();

  const style = edgeConfig[type ?? "default"] ?? edgeConfig.default;

  const onEdgeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("edge click", id);
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    deleteEdge(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Box
          component="div"
          style={{
            pointerEvents: "all",
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            zIndex: 9999,
          }}
        >
          <Button
            onClick={onEdgeClick}
            sx={{
              borderColor: "red",
              borderRadius: "50%",
              height: 20,
              minWidth: "auto",
              padding: 0,
              pointerEvents: "all",
              width: 20,
            }}
          >
            ×
          </Button>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(EdgeFactory);
