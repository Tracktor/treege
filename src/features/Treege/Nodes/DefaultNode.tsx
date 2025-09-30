import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type DefaultNodeType = Node<
  {
    forceToolbarVisible?: boolean;
    toolbarPosition?: Position;
    label?: string;
  },
  "default"
>;

type DefaultNodeProps = NodeProps<DefaultNodeType>;

const DefaultNode = ({ data, isConnectable, type }: DefaultNodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />

    {/* Label */}
    <div className="text-2xl">{data?.label}</div>

    {/* Type */}
    {type !== "default" && (
      <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
        <BadgeCheckIcon />
        {type}
      </Badge>
    )}

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />
  </>
);

export default DefaultNode;
