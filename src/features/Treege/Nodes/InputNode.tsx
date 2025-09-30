import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { LucideRectangleEllipsis } from "lucide-react";
import { HTMLInputTypeAttribute } from "react";
import { Badge } from "@/components/ui/badge";

export type InputNodeType = Node<
  {
    forceToolbarVisible?: boolean;
    toolbarPosition?: Position;
    label?: string;
    name?: string;
    type?: HTMLInputTypeAttribute;
    data?: {
      label?: string;
      name?: string;
      type?: HTMLInputTypeAttribute;
    };
  },
  "input"
>;

type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type }: InputNodeProps) => (
  <>
    {/* Top handle */}
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />

    {/* Label */}
    <div className="text-2xl">{data?.label || data?.name}</div>

    {/* Type */}
    {type && (
      <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
        <LucideRectangleEllipsis />
        {type}
      </Badge>
    )}

    {/* Bot handle */}
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ height: 10, width: 10 }} />
  </>
);

export default InputNode;
