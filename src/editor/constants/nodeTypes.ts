import FlowNode from "@/editor/features/TreegeEditor/Nodes/FlowNode";
import GroupNode from "@/editor/features/TreegeEditor/Nodes/GroupNode";
import InputNode from "@/editor/features/TreegeEditor/Nodes/InputNode";
import JsonNode from "@/editor/features/TreegeEditor/Nodes/JsonNode";
import UINode from "@/editor/features/TreegeEditor/Nodes/UINode";

export const nodeTypes = {
  flow: FlowNode,
  group: GroupNode,
  input: InputNode,
  json: JsonNode,
  ui: UINode,
};
