import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { Box } from "@tracktor/design-system";
import { Handle, Position, useNodeConnections } from "@xyflow/react";
import React, { CSSProperties, FC } from "react";
import colors from "@/constants/colors";

interface HandleSourceProps {
  handleId: string;
  position?: Position;
  rotation?: string;
  style?: CSSProperties;
}

const HandleSource: FC<HandleSourceProps> = ({ handleId, position = Position.Right, rotation = "-90deg", style }) => {
  const connections = useNodeConnections({
    handleId,
    handleType: "source",
  });

  const isConnected = connections.length > 0;

  return (
    <Box sx={{ position: "relative" }}>
      <Handle
        type="source"
        position={position}
        id={handleId}
        isValidConnection={() => !isConnected}
        style={{
          height: 18,
          width: 18,
          ...style,
        }}
      >
        <ArrowDropDownCircleIcon
          sx={{
            "&:hover": { backgroundColor: colors.secondary },
            backgroundColor: isConnected ? colors.grey500 : colors.primary,
            borderRadius: "50%",
            bottom: -12,
            color: colors.background,
            cursor: "pointer",
            fontSize: 20,
            left: "calc(50% - 10px)",
            position: "absolute",
            transform: `translateY(-50%) rotate(${rotation})`,
            ...style,
          }}
        />
      </Handle>
    </Box>
  );
};

export default HandleSource;
