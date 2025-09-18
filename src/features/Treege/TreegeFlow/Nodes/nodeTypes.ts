import BooleanNode from "@/features/Treege/TreegeFlow/Nodes/BooleanNode";
import OptionNode from "@/features/Treege/TreegeFlow/Nodes/OptionNode";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/TextNode";

export type Attributes = {
  key: string;
  value?: string;
};

export type NodeOptions = {
  name?: string;
  type?: string;
  isDecision?: boolean;
  sourceHandle?: string;
  attributes?: Attributes[];
};

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
