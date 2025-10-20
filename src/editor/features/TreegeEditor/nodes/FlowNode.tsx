import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Network } from "lucide-react";
import NodeWrapper from "@/editor/features/TreegeEditor/nodes/layout/NodeWrapper";
import useTranslate from "@/editor/hooks/useTranslate";
import { Badge } from "@/shared/components/ui/badge";
import { FlowNodeData } from "@/shared/types/node";

export type FlowNodeType = Node<FlowNodeData, "flow">;
export type FlowNodeProps = NodeProps<FlowNodeType>;

const FlowNode = ({ data, isConnectable, type, parentId }: FlowNodeProps) => {
  const translate = useTranslate();
  const label = translate(data?.label);

  return (
    <NodeWrapper inGroup={!!parentId}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {/* Label */}
      <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1">{label}</div>

      {/* Type */}
      <Badge variant="destructive">
        <Network />
        {type}
      </Badge>

      {/* Bot handle */}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </NodeWrapper>
  );
};

export default FlowNode;
