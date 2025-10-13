import FlowNode from "@/editor/features/Treege/Nodes/FlowNode";
import GroupNode from "@/editor/features/Treege/Nodes/GroupNode";
import InputNode from "@/editor/features/Treege/Nodes/InputNode";
import JsonNode from "@/editor/features/Treege/Nodes/JsonNode";
import UINode from "@/editor/features/Treege/Nodes/UINode";

export const nodeTypes = {
  flow: FlowNode,
  group: GroupNode,
  input: InputNode,
  json: JsonNode,
  ui: UINode,
};
