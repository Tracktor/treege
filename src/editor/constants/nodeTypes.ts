import FlowNode from "@/editor/features/TreegeEditor/nodes/FlowNode";
import GroupNode from "@/editor/features/TreegeEditor/nodes/GroupNode";
import InputNode from "@/editor/features/TreegeEditor/nodes/InputNode";
import JsonNode from "@/editor/features/TreegeEditor/nodes/JsonNode";
import UINode from "@/editor/features/TreegeEditor/nodes/UINode";
import { NODE_TYPE } from "@/shared/constants/node";

export const nodeTypes = {
  [NODE_TYPE.flow]: FlowNode,
  [NODE_TYPE.group]: GroupNode,
  [NODE_TYPE.input]: InputNode,
  [NODE_TYPE.json]: JsonNode,
  [NODE_TYPE.ui]: UINode,
};
