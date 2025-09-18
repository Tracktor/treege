import { NodeOptions } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import BooleanNode from "@/features/Treege/TreegeFlow/Nodes/BooleanNode";
import OptionNode from "@/features/Treege/TreegeFlow/Nodes/OptionNode";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/TextNode";

export type CustomNodeData = NodeOptions & {
  order?: number;
  onAddNode?: (parentId: string, childId?: string, options?: NodeOptions) => void;
};

const nodeTypes = {
  boolean: BooleanNode,
  option: OptionNode,
  text: TextNode,
};

export default nodeTypes;
