import { Handle, type NodeProps, Position } from "@xyflow/react";
import { AppNode } from "@/components/DataDisplay/Nodes";

const DefaultNode = ({ data }: NodeProps<AppNode>) => (
  <div>
    {/* Node Name */}
    <div className="uppercase truncate">{data.label}</div>

    {/* Handles dragging the node */}
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);

export default DefaultNode;
