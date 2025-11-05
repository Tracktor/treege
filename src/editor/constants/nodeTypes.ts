import FlowNode from "@/editor/features/TreegeEditor/nodes/FlowNode";
import GroupNode from "@/editor/features/TreegeEditor/nodes/GroupNode";
import InputNode from "@/editor/features/TreegeEditor/nodes/InputNode";
import UINode from "@/editor/features/TreegeEditor/nodes/UINode";
import { NODE_TYPE } from "@/shared/constants/node";

export const NODE_TYPES = {
  [NODE_TYPE.flow]: FlowNode,
  [NODE_TYPE.group]: GroupNode,
  [NODE_TYPE.input]: InputNode,
  [NODE_TYPE.ui]: UINode,
};
