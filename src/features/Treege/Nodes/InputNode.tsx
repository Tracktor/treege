import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ActionNodeToolbar from "@/features/Treege/NodesToolbar/ActionNodeToolbar";

export type InputNodeType = Node<
  {
    forceToolbarVisible?: boolean;
    toolbarPosition?: Position;
    label?: string;
  },
  "input"
>;

type InputNodeProps = NodeProps<InputNodeType>;

const InputNode = ({ data, isConnectable, type }: InputNodeProps) => (
  <>
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <ActionNodeToolbar forceToolbarVisible={data?.forceToolbarVisible} toolbarPosition={data?.toolbarPosition} />
    <div className="text-2xl">{data?.label}</div>
    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
      <BadgeCheckIcon />
      {type}
    </Badge>
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </>
);

export default InputNode;
