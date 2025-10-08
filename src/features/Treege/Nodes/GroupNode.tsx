import { Node, NodeProps, NodeResizer } from "@xyflow/react";
import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TranslatableLabel } from "@/Types/translate";

export type GroupNodeData = {
  label: TranslatableLabel;
};

export type GroupNodeType = Node<GroupNodeData, "group">;

export type GroupNodeProps = NodeProps<GroupNodeType>;

const GroupNode = ({ data }: GroupNodeProps) => (
  <>
    <NodeResizer />
    <div className="absolute left-6 -top-3.5 ">
      <Badge className="bg-chart-2 max-w-50">
        <Boxes className="!w-3 !h-3" />
        {data.label?.en}
      </Badge>
    </div>
  </>
);

export default GroupNode;
