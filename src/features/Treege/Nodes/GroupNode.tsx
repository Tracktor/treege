import { Node, NodeProps, NodeResizer } from "@xyflow/react";
import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type GroupNodeData = {
  label: string;
};

export type GroupNodeType = Node<GroupNodeData, "group">;

export type GroupNodeProps = NodeProps<GroupNodeType>;

const GroupNode = ({ data }: GroupNodeProps) => (
  <>
    <NodeResizer />
    <div className="absolute left-6 -top-3.5 ">
      {data.label && (
        <Badge className="bg-chart-2 max-w-50">
          <Boxes className="!w-3 !h-3" />
          {data.label}
        </Badge>
      )}
    </div>
  </>
);

export default GroupNode;
