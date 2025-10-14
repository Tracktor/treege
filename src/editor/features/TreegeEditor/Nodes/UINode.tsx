import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { LucidePencilRuler, Type } from "lucide-react";
import NodeWrapper from "@/editor/features/TreegeEditor/Nodes/Layout/NodeWrapper";
import useTranslatedLabel from "@/editor/hooks/useTranslatedLabel";
import { Badge } from "@/shared/components/ui/badge";
import { UINodeData } from "@/shared/types/node";

export type UINodeType = Node<UINodeData, "ui">;
export type UINodeProps = NodeProps<UINodeType>;

const UINode = ({ data, isConnectable, type, parentId }: UINodeProps) => {
  const translateLabel = useTranslatedLabel();
  const label = translateLabel(data?.label);

  return (
    <NodeWrapper inGroup={!!parentId}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {/* Label */}
      <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1 capitalize">{label}</div>

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
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </NodeWrapper>
  );
};

export default UINode;
