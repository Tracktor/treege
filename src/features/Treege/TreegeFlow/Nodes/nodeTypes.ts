import BooleanNode from "@/features/Treege/TreegeFlow/Nodes/BooleanNode";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/TextNode";

export type NodeOptions = {
  name?: string;
  type?: string;
  isDecision?: boolean;
};

export type CustomNodeData = {
  name: string;
  order?: number;
  type?: string;
  isDecision?: boolean;
  onAddNode?: (parentId: string, childId?: string, options?: NodeOptions) => void;
};

const nodeTypes = {
  boolean: BooleanNode,
  text: TextNode,
};

export default nodeTypes;
