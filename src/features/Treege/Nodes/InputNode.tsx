import { Handle, Node, NodeProps, Position } from "@xyflow/react";
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
    <div className="text-sm">{data?.label}</div>
    <span className="bg-blue-700 rounded-full px-1 text-xs font-mono">{type}</span>
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </>
);

export default InputNode;
