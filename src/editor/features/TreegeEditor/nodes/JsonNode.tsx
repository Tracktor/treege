import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Braces } from "lucide-react";
import NodeWrapper from "@/editor/features/TreegeEditor/nodes/layout/NodeWrapper";
import useTranslatedLabel from "@/editor/hooks/useTranslatedLabel";
import { Badge } from "@/shared/components/ui/badge";
import { JsonNodeData } from "@/shared/types/node";

export type JsonNodeType = Node<JsonNodeData, "json">;
export type JsonNodeProps = NodeProps<JsonNodeType>;

const JsonNode = ({ data, isConnectable, type, parentId }: JsonNodeProps) => {
  const translateLabel = useTranslatedLabel();
  const label = translateLabel(data?.label);

  return (
    <NodeWrapper inGroup={!!parentId}>
      {/* Top handle */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {/* Label */}
      <div className="text-2xl text-nowrap text-ellipsis overflow-hidden max-w-full mb-1">{label}</div>

      {/* Type */}
      <Badge>
        <Braces />
        {type}
      </Badge>

      {/* Bot handle */}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </NodeWrapper>
  );
};

export default JsonNode;
