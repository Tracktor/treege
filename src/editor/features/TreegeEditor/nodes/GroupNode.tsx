import { Node, NodeProps, NodeResizer } from "@xyflow/react";
import { Boxes } from "lucide-react";
import { memo } from "react";
import useTranslate from "@/editor/hooks/useTranslate";
import { Badge } from "@/shared/components/ui/badge";
import { GroupNodeData } from "@/shared/types/node";

export type GroupNodeType = Node<GroupNodeData, "group">;
export type GroupNodeProps = NodeProps<GroupNodeType>;

const GroupNode = ({ data }: GroupNodeProps) => {
  const translate = useTranslate();
  const label = translate(data?.label);

  return (
    <>
      <NodeResizer />
      <div className="-top-3.5 absolute left-6">
        <Badge className="max-w-50 bg-chart-2">
          <Boxes className="!w-3 !h-3" />
          {label}
        </Badge>
      </div>
    </>
  );
};

export default memo(GroupNode);
