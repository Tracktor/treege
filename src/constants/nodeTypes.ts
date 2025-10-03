import FlowNode from "@/features/Treege/Nodes/FlowNode";
import InputNode from "@/features/Treege/Nodes/InputNode";
import JsonNode from "@/features/Treege/Nodes/JsonNode";
import UINode from "@/features/Treege/Nodes/UINode";

const nodeTypes = {
  flow: FlowNode,
  input: InputNode,
  json: JsonNode,
  ui: UINode,
};

export default nodeTypes;
