import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NodeWrapper from "@/features/Treege/Nodes/Layout/NodeWrapper";

export type FlowNodeData = {
  label?: string;
  targetId?: string;
};

export type FlowNodeType = Node<FlowNodeData, "flow">;

export type FlowNodeProps = NodeProps<FlowNodeType>;

const FlowNode = ({ data, isConnectable, type }: FlowNodeProps) => (
  <NodeWrapper>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-center text-nowrap text-ellipsis overflow-hidden max-w-full px-6 mb-1">{data?.label}</div>

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
