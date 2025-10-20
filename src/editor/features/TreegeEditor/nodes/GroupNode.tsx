import { Node, NodeProps, NodeResizer } from "@xyflow/react";
import { Boxes } from "lucide-react";
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
      <div className="absolute left-6 -top-3.5 ">
        <Badge className="bg-chart-2 max-w-50">
          <Boxes className="!w-3 !h-3" />
          {label}
        </Badge>
      </div>
    </>
  );
};

export default GroupNode;
