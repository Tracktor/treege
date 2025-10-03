import { Node, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";

export type GroupNodeData = {
  label: string;
};

export type GroupNodeType = Node<GroupNodeData, "group">;

export type GroupNodeProps = NodeProps<GroupNodeType>;

const GroupNode = ({ data }: GroupNodeProps) => (
  <div className="absolute left-4 -top-3">
    <Badge variant="outline" className="bg-background">
      {data.label}
    </Badge>
  </div>
);

export default GroupNode;
