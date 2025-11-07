import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Plus, Type } from "lucide-react";
import { memo } from "react";
import useBottomHandleClick from "@/editor/features/TreegeEditor/nodes/hooks/useBottomHandleClick";
import NodeWrapper from "@/editor/features/TreegeEditor/nodes/layout/NodeWrapper";
import useTranslate from "@/editor/hooks/useTranslate";
import { Badge } from "@/shared/components/ui/badge";
import { InputNodeData } from "@/shared/types/node";

export type InputNodeType = Node<InputNodeData, "input">;
export type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, parentId, id }: InputNodeProps) => {
  const translate = useTranslate();
  const label = translate(data?.label);
  const handleBottomHandleClick = useBottomHandleClick(id);

  return (
    <NodeWrapper inGroup={!!parentId} isSubmit={data?.type === "submit"}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} isConnectableStart={false} />

      {/* Label */}
      <div className="mb-1 max-w-full overflow-hidden text-ellipsis text-nowrap text-2xl">{label || data?.name}</div>

      {/* Input type */}
      <div className="flex gap-1">
        {data?.type && (
          <Badge variant="blue" className="capitalize">
            <Type />
            {data.type}
          </Badge>
        )}
      </div>

      {/* Bot handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        onClick={handleBottomHandleClick}
        className="hover:!bg-primary/80 flex cursor-pointer items-center justify-center rounded-sm transition-colors"
      >
        <Plus className="h-4 w-4 text-primary-foreground" />
      </Handle>
    </NodeWrapper>
  );
};

export default memo(InputNode);
