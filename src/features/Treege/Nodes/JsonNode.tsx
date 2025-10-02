import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Braces } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type JsonNodeData = {
  label?: string;
  json?: string;
};

export type JsonNodeType = Node<JsonNodeData, "json">;

export type JsonNodeProps = NodeProps<JsonNodeType>;

const JsonNode = ({ data, isConnectable, type }: JsonNodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl">{data?.label}</div>

    {/* Type */}
    <Badge>
      <Braces />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </>
);

export default JsonNode;
