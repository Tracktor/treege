import { Handle, Position } from "@xyflow/react";
import React, { FC, useContext } from "react";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";

const handleSize = 10;
const offset = -(handleSize / 2);

const handlerStyle = (isVertical: boolean) => {
  const transform = isVertical ? "translateX(-50%)" : "translateY(-50%)";

  return {
    height: handleSize,
    left: isVertical ? "50%" : offset,
    top: isVertical ? offset : "50%",
    transform,
    width: handleSize,
  };
};

interface HandleTargetProps {
  handleId: string;
}

const HandleTarget: FC<HandleTargetProps> = ({ handleId }) => {
  const { orientation } = useContext(TreegeFlowContext);
  const isVertical = orientation === "vertical";
  const position = isVertical ? Position.Top : Position.Left;

  return <Handle type="target" position={position} id={handleId} style={handlerStyle(isVertical)} />;
};

export default HandleTarget;
