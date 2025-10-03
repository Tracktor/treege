import FlowNode from "@/features/Treege/Nodes/FlowNode";
import GroupNode from "@/features/Treege/Nodes/GroupNode";
import InputNode from "@/features/Treege/Nodes/InputNode";
import JsonNode from "@/features/Treege/Nodes/JsonNode";
import UINode from "@/features/Treege/Nodes/UINode";

const nodeTypes = {
  flow: FlowNode,
  group: GroupNode,
  input: InputNode,
  json: JsonNode,
  ui: UINode,
};

export default nodeTypes;
