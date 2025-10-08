import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { RectangleEllipsis, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InputType } from "@/features/Treege/Inputs/SelectInputType";
import NodeWrapper from "@/features/Treege/Nodes/Layout/NodeWrapper";
import { TranslatableLabel } from "@/Types/translate";

export type InputNodeData = {
  label?: TranslatableLabel;
  name?: string;
  type?: InputType;
  helperText?: string;
  required?: boolean;
  pattern?: string;
  errorMessage?: string;
};

export type InputNodeType = Node<InputNodeData, "input">;

export type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type, parentId }: InputNodeProps) => (
  <NodeWrapper inGroup={!!parentId}>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1">{data?.label?.en || data?.name}</div>

    {/* Input type */}
    <div className="flex gap-1">
      {type && (
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
