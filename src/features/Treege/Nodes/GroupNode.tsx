import { Node, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";

export type GroupNodeData = {
  label: string;
};

export type GroupNodeType = Node<GroupNodeData, "group">;

export type GroupNodeProps = NodeProps<GroupNodeType>;

const GroupNode = ({ data }: GroupNodeProps) => (
  <div className="absolute left-6 -top-3.5 ">
    <Badge className="bg-chart-2">{data.label}</Badge>
  </div>
);

export default GroupNode;
