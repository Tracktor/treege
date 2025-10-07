import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { RectangleEllipsis, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type InputNodeData = {
  label?: string;
  name?: string;
  type?: string;
};

export type InputNodeType = Node<InputNodeData, "input">;

export type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type }: InputNodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-center text-nowrap text-ellipsis overflow-hidden max-w-full px-6 mb-1">{data?.label}</div>

    {/* Type */}
    <div className="flex gap-1">
      <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
        <RectangleEllipsis />
        {type}
      </Badge>

      {data?.type && (
        <Badge variant="outline">
          <Type />
          {data.type}
        </Badge>
      )}
    </div>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </>
);

export default InputNode;
