import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { Handle, Position, useNodeConnections } from "@xyflow/react";
import React, { FC, useContext } from "react";
import colors from "@/constants/colors";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";

const handleSize = 18;
const offset = -(handleSize / 2);

const handleStyle = (isVertical: boolean) => ({
  height: handleSize,
  left: isVertical ? "50%" : `calc(100% + ${offset}px)`,
  top: isVertical ? `calc(100% + ${offset}px)` : "50%",
  transform: isVertical ? "translateX(-50%)" : "translateY(-50%)",
  width: handleSize,
});

const handleIconStyle = (isVertical: boolean, isConnected: boolean) => {
  const iconTransform = isVertical ? "translate(-50%, -50%) rotate(0deg)" : "translate(-50%, -50%) rotate(-90deg)";

  return {
    "&:hover": { backgroundColor: colors.secondary },
    backgroundColor: isConnected ? colors.grey500 : colors.primary,
    borderRadius: "50%",
    color: colors.background,
    cursor: "pointer",
    fontSize: handleSize,
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: iconTransform,
  };
};

interface HandleSourceProps {
  handleId: string;
}

const HandleSource: FC<HandleSourceProps> = ({ handleId }) => {
  const { orientation } = useContext(TreegeFlowContext);
  const connections = useNodeConnections({
    handleId,
    handleType: "source",
  });

  const isVertical = orientation === "vertical";
  const isConnected = connections.length > 0;
  const position = isVertical ? Position.Bottom : Position.Right;

  return (
    <Handle type="source" position={position} id={handleId} isValidConnection={() => !isConnected} style={handleStyle(isVertical)}>
      <ArrowDropDownCircleIcon sx={handleIconStyle(isVertical, isConnected)} />
    </Handle>
  );
};

export default HandleSource;
