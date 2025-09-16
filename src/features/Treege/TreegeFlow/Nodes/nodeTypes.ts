import TextNode from "@/features/Treege/TreegeFlow/Nodes/Text";

export type CustomNodeData = {
  name: string;
  onAddNode?: (parentId: string, childId?: string) => void;
  onDeleteNode?: (parentId: string, childId?: string) => void;
};

const nodeTypes = {
  text: TextNode,
};

export default nodeTypes;
