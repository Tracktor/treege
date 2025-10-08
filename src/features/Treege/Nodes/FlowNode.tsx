import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NodeWrapper from "@/features/Treege/Nodes/Layout/NodeWrapper";

export type FlowNodeData = {
  label?: {
    en?: string;
    [key: string]: string | undefined;
  };
  targetId?: string;
};

export type FlowNodeType = Node<FlowNodeData, "flow">;

export type FlowNodeProps = NodeProps<FlowNodeType>;

const FlowNode = ({ data, isConnectable, type, parentId }: FlowNodeProps) => (
  <NodeWrapper inGroup={!!parentId}>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1">{data?.label?.en}</div>

    {/* Type */}
    <Badge variant="destructive">
      <Network />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </NodeWrapper>
);

export default FlowNode;
