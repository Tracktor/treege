import { Handle, Position } from "@xyflow/react";
import React, { FC, useContext } from "react";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";

interface HandleTargetProps {
  handleId: string;
}

const HandleTarget: FC<HandleTargetProps> = ({ handleId }) => {
  const { orientation } = useContext(TreegeFlowContext);
  const isVertical = orientation === "vertical";

  const handleSize = 10;

  const offset = -(handleSize / 2);

  return (
    <Handle
      type="target"
      position={isVertical ? Position.Top : Position.Left}
      id={handleId}
      style={{
        height: handleSize,
        left: isVertical ? "50%" : offset,
        top: isVertical ? offset : "50%",
        transform: isVertical ? "translateX(-50%)" : "translateY(-50%)",
        width: handleSize,
      }}
    />
  );
};

export default HandleTarget;
