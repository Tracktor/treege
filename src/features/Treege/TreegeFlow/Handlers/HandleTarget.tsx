import { Box } from "@tracktor/design-system";
import { Handle, Position, useNodeConnections } from "@xyflow/react";
import React, { CSSProperties, FC } from "react";

interface HandleTargetProps {
  handleId: string;
  position?: Position;
  style?: CSSProperties;
}

const HandleTarget: FC<HandleTargetProps> = ({ handleId, position = Position.Top, style }) => {
  const connections = useNodeConnections({
    handleId,
    handleType: "target",
  });

  const isConnected = connections.length > 0;
  console.log(isConnected);

  return (
    <Box sx={{ position: "relative" }}>
      <Handle
        type="target"
        position={position}
        id={handleId}
        style={{
          height: 10,
          width: 10,
          ...style,
        }}
      />
    </Box>
  );
};

export default HandleTarget;
