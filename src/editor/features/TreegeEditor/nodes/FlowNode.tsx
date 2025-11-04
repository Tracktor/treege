import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Network, Plus } from "lucide-react";
import useBottomHandleClick from "@/editor/features/TreegeEditor/nodes/hooks/useBottomHandleClick";
import NodeWrapper from "@/editor/features/TreegeEditor/nodes/layout/NodeWrapper";
import useTranslate from "@/editor/hooks/useTranslate";
import { Badge } from "@/shared/components/ui/badge";
import { FlowNodeData } from "@/shared/types/node";

export type FlowNodeType = Node<FlowNodeData, "flow">;
export type FlowNodeProps = NodeProps<FlowNodeType>;

const FlowNode = ({ data, isConnectable, type, parentId, id }: FlowNodeProps) => {
  const translate = useTranslate();
  const label = translate(data?.label);
  const handleBottomHandleClick = useBottomHandleClick(id);

  return (
    <NodeWrapper inGroup={!!parentId}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} isConnectableStart={false} />

      {/* Label */}
      <div className="mb-1 max-w-full overflow-hidden text-ellipsis text-nowrap text-2xl">{label}</div>

      {/* Type */}
      <Badge variant="destructive">
        <Network />
        {type}
      </Badge>

      {/* Bot handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        onClick={handleBottomHandleClick}
        className="hover:!bg-primary/80 !w-6 !h-6 flex cursor-pointer items-center justify-center rounded-sm transition-colors"
      >
        <Plus className="h-4 w-4 text-primary-foreground" />
      </Handle>
    </NodeWrapper>
  );
};

export default FlowNode;
