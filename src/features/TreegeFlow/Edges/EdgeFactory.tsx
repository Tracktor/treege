import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Box } from "@tracktor/design-system";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, Position, useReactFlow } from "@xyflow/react";
import { CSSProperties, memo, MouseEvent } from "react";
import colors from "@/constants/colors";
import edgeConfig from "@/features/TreegeFlow/Edges/edgeConfig";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

type ExtendedEdgeProps = EdgeProps & { type?: string };

interface EdgeParams {
  id: string;
  showDeleteButton?: boolean;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  markerEnd?: string;
  style: CSSProperties;
}

const EdgeRender = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  showDeleteButton,
}: EdgeParams) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    borderRadius: 10,
    offset: 5,
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  });

  const { setEdges } = useReactFlow();
  const { deleteEdge } = useTreegeFlowContext();

  const onEdgeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
          {showDeleteButton && (
            <IconButton
              size="small"
              color="error"
              onClick={onEdgeClick}
              sx={{
                bgcolor: "transparent",
              }}
            >
              <HighlightOffIcon
                sx={{
                  bgcolor: colors.background,
                  height: 15,
                  width: 15,
                }}
              />
            </IconButton>
          )}
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};

const EdgeFactory = ({ id, type, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd }: ExtendedEdgeProps) => {
  const config = type ? edgeConfig[type] : edgeConfig.default;

  return (
    <EdgeRender
      id={id}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      markerEnd={markerEnd}
      style={config.style}
      showDeleteButton={config.showDeleteButton}
    />
  );
};

export default memo(EdgeFactory);
