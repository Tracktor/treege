import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { RectangleEllipsis, Type } from "lucide-react";
import NodeWrapper from "@/editor/features/TreegeEditor/nodes/layout/NodeWrapper";
import useTranslate from "@/editor/hooks/useTranslate";
import { Badge } from "@/shared/components/ui/badge";
import { InputNodeData } from "@/shared/types/node";

export type InputNodeType = Node<InputNodeData, "input">;
export type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type, parentId }: InputNodeProps) => {
  const translate = useTranslate();
  const label = translate(data?.label);

  return (
    <NodeWrapper inGroup={!!parentId}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {/* Label */}
      <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1">{label || data?.name}</div>

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
};

export default InputNode;
