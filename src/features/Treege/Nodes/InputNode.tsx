import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { RectangleHorizontal } from "lucide-react";
import { HTMLInputTypeAttribute } from "react";
import { Badge } from "@/components/ui/badge";

export type InputNodeData = {
  label?: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
};

export type InputNodeType = Node<InputNodeData, "input">;

export type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type }: InputNodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl">{data?.label}</div>

    {/* Type */}
    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
      <RectangleHorizontal />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </>
);

export default InputNode;
