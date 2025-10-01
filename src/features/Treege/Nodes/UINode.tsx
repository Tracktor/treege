import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { LucidePencilRuler } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type UINodeData = {
  label?: string;
  type?: string;
};

export type UINodeType = Node<UINodeData, "ui">;

export type UINodeProps = NodeProps<UINodeType>;

const UINode = ({ data, isConnectable, type }: UINodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />

    {/* Label */}
    <div className="text-2xl">{data?.label}</div>

    {/* Type */}
    <Badge variant="destructive">
      <LucidePencilRuler />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />
  </>
);

export default UINode;
