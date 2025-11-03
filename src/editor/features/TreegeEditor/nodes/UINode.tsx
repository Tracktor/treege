import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { LucidePencilRuler, Type } from "lucide-react";
import NodeWrapper from "@/editor/features/TreegeEditor/nodes/layout/NodeWrapper";
import useBottomHandleClick from "@/editor/features/TreegeEditor/nodes/useBottomHandleClick";
import useTranslate from "@/editor/hooks/useTranslate";
import { Badge } from "@/shared/components/ui/badge";
import { UINodeData } from "@/shared/types/node";

export type UINodeType = Node<UINodeData, "ui">;
export type UINodeProps = NodeProps<UINodeType>;

const UINode = ({ data, isConnectable, type, parentId, id }: UINodeProps) => {
  const translate = useTranslate();
  const label = translate(data?.label);
  const handleBottomHandleClick = useBottomHandleClick(id);

  return (
    <NodeWrapper inGroup={!!parentId}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {/* Label */}
      <div className="mb-1 max-w-full overflow-hidden text-ellipsis text-nowrap text-2xl capitalize">{label}</div>

      {/* Type */}

      {/* Input type */}
      <div className="flex gap-1">
        <Badge variant="purple">
          <LucidePencilRuler />
          {type}
        </Badge>

        {data?.type && (
          <Badge variant="outline">
            <Type />
            {data.type}
          </Badge>
        )}
      </div>

      {/* Bot handle */}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} onClick={handleBottomHandleClick} />
    </NodeWrapper>
  );
};

export default UINode;
