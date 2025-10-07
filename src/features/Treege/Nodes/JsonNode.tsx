import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Braces } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NodeWrapper from "@/features/Treege/Nodes/Layout/NodeWrapper";

export type JsonNodeData = {
  label?: string;
  json?: string;
};

export type JsonNodeType = Node<JsonNodeData, "json">;

export type JsonNodeProps = NodeProps<JsonNodeType>;

const JsonNode = ({ data, isConnectable, type }: JsonNodeProps) => (
  <NodeWrapper>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-center text-nowrap text-ellipsis overflow-hidden max-w-full px-6 mb-1">{data?.label}</div>

    {/* Type */}
    <Badge>
      <Braces />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </NodeWrapper>
);

export default JsonNode;
