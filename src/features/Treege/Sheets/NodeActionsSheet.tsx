import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import FlowNodeForm from "@/features/Treege/Forms/FlowNodeForm";
import GroupNodeForm from "@/features/Treege/Forms/GroupNodeForm";
import InputNodeForm from "@/features/Treege/Forms/InputNodeForm";
import JsonNodeForm from "@/features/Treege/Forms/JsonNodeForm";
import UINodeForm from "@/features/Treege/Forms/UINodeForm";
import SelectNodeGroup from "@/features/Treege/Inputs/SelectNodeGroup";
import SelectNodeType from "@/features/Treege/Inputs/SelectNodeType";
import useFlowActions from "@/hooks/useFlowActions";
import useNodesSelection from "@/hooks/useNodesSelection";
import { TreegeNodeData } from "@/type/node";
import { isFlowNode, isGroupNode, isInputNode, isJsonNode, isUINode } from "@/utils/nodeTyoeGuards";

const NodeActionsSheet = () => {
  const { selectedNode, hasSelectedNodes } = useNodesSelection<TreegeNodeData>();
  const { clearSelection } = useFlowActions();

  return (
    <Sheet open={hasSelectedNodes} onOpenChange={clearSelection}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit node</SheetTitle>
          <SheetDescription>
            {String(selectedNode?.data?.label?.en || "")}
            {!!selectedNode?.id && !!selectedNode?.data?.label?.en && " - "}
            {selectedNode?.id}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col px-4 flex-1 min-h-0 space-y-6 pt-6">
          <SelectNodeType />
          <SelectNodeGroup />

          <Separator />

          {isInputNode(selectedNode) && <InputNodeForm />}
          {isUINode(selectedNode) && <UINodeForm />}
          {isJsonNode(selectedNode) && <JsonNodeForm />}
          {isFlowNode(selectedNode) && <FlowNodeForm />}
          {isGroupNode(selectedNode) && <GroupNodeForm />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeActionsSheet;
