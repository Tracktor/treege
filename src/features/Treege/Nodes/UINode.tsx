import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { LucidePencilRuler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NodeWrapper from "@/features/Treege/Nodes/Layout/NodeWrapper";

export type UINodeData = {
  type?: string;
  label?: string;
};

export type UINodeType = Node<UINodeData, "ui">;

export type UINodeProps = NodeProps<UINodeType>;

const UINode = ({ data, isConnectable, type, parentId }: UINodeProps) => (
  <NodeWrapper inGroup={!!parentId}>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

    {/* Label */}
    <div className="text-2xl text-center text-nowrap text-ellipsis overflow-hidden max-w-full px-6 mb-1 capitalize">{data?.type}</div>

    {/* Type */}
    <Badge variant="purple">
      <LucidePencilRuler />
      {type}
    </Badge>

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </NodeWrapper>
);

export default UINode;
