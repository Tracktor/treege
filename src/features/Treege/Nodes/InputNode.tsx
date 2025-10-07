import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { RectangleEllipsis, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NodeWrapper from "@/features/Treege/Nodes/Layout/NodeWrapper";

export type InputNodeData = {
  label?: string;
  name?: string;
  type?: string;
};

export type InputNodeType = Node<InputNodeData, "input">;

export type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type, parentId }: InputNodeProps) => (
  <NodeWrapper inGroup={!!parentId}>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1">{data?.label || data?.name}</div>

    {/* Input type */}
    <div className="flex gap-1">
      {data.type && (
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
          <RectangleEllipsis />
          {type}
        </Badge>
      )}

      {data?.type && (
        <Badge variant="outline">
          <Type />
          {data.type}
        </Badge>
      )}
    </div>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </NodeWrapper>
);

export default InputNode;
