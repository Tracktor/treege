import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Columns3Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type CustomNodeData = {
  label?: string;
};

export type CustomNodeType = Node<CustomNodeData, "default">;

export type CustomNodeProps = NodeProps<CustomNodeType>;

const CustomNode = ({ data, isConnectable, type }: CustomNodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />

    {/* Label */}
    <div className="text-2xl">{data?.label}</div>

    {/* Type */}
    <Badge>
      <Columns3Cog />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />
  </>
);

export default CustomNode;
