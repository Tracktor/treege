import { Node, NodeProps, NodeResizer } from "@xyflow/react";
import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useTranslatedLabel from "@/hooks/useTranslatedLabel";
import { BaseNodeData } from "@/type/node";
import { TranslatableLabel } from "@/type/translate";

export type GroupNodeData = BaseNodeData & {
  label: TranslatableLabel;
};

export type GroupNodeType = Node<GroupNodeData, "group">;

export type GroupNodeProps = NodeProps<GroupNodeType>;

const GroupNode = ({ data }: GroupNodeProps) => {
  const translateLabel = useTranslatedLabel();
  const label = translateLabel(data?.label);

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
