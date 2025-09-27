import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { Box } from "@tracktor/design-system";
import { Handle, Position, useNodeConnections } from "@xyflow/react";
import React, { FC, useContext } from "react";
import colors from "@/constants/colors";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";
import { NODE_CARD_HEIGHT } from "@/features/TreegeFlow/Nodes/NodeFactory";

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

  return (
    <Box sx={{ position: "relative" }}>
      <Handle
        type="source"
        position={isVertical ? Position.Bottom : Position.Right}
        id={handleId}
        isValidConnection={() => !isConnected}
        style={{
          height: 18,
          width: 18,
        }}
      >
        <ArrowDropDownCircleIcon
          sx={{
            "&:hover": { backgroundColor: colors.secondary },
            backgroundColor: isConnected ? colors.grey500 : colors.primary,
            borderRadius: "50%",
            bottom: isVertical ? -12 : NODE_CARD_HEIGHT / 2,
            color: colors.background,
            cursor: "pointer",
            fontSize: 20,
            left: "calc(50% - 10px)",
            position: "absolute",
            top: "50%",
            transform: `translateY(${isVertical ? "-50%" : "0%"}) rotate(${isVertical ? "0deg" : "-90deg"})`,
          }}
        />
      </Handle>
    </Box>
  );
};

export default HandleSource;
