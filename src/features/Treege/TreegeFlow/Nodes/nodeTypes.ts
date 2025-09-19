import { NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import NodeFactory from "@/features/Treege/TreegeFlow/Nodes/NodeFactory";

export type CustomNodeData = NodeOptions & {
  order?: number;
  onAddNode?: (parentId: string, childId?: string, options?: NodeOptions) => void;
  options?: NodeOptions[];
};

const nodeTypes = {
  boolean: NodeFactory,
  option: NodeFactory,
  text: NodeFactory,
};

export default nodeTypes;
