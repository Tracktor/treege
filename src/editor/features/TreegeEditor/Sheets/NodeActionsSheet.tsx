import FlowNodeForm from "@/editor/features/TreegeEditor/Forms/FlowNodeForm";
import GroupNodeForm from "@/editor/features/TreegeEditor/Forms/GroupNodeForm";
import InputNodeForm from "@/editor/features/TreegeEditor/Forms/InputNodeForm";
import JsonNodeForm from "@/editor/features/TreegeEditor/Forms/JsonNodeForm";
import UINodeForm from "@/editor/features/TreegeEditor/Forms/UINodeForm";
import SelectNodeGroup from "@/editor/features/TreegeEditor/Inputs/SelectNodeGroup";
import SelectNodeType from "@/editor/features/TreegeEditor/Inputs/SelectNodeType";
import useFlowActions from "@/editor/hooks/useFlowActions";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import useTranslatedLabel from "@/editor/hooks/useTranslatedLabel";
import { Separator } from "@/shared/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { TreegeNodeData } from "@/shared/types/node";
import { isFlowNode, isGroupNode, isInputNode, isJsonNode, isUINode } from "@/shared/utils/nodeTypeGuards";

const NodeActionsSheet = () => {
  const { selectedNode, hasSelectedNodes } = useNodesSelection<TreegeNodeData>();
  const { clearSelection } = useFlowActions();
  const translateLabel = useTranslatedLabel();
  const label = translateLabel(selectedNode?.data?.label);

  return (
    <Sheet open={hasSelectedNodes} onOpenChange={clearSelection}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Edit node <span className="text-xs text-muted-foreground font-light">{selectedNode?.id}</span>
          </SheetTitle>
          <SheetDescription>{label || "\u00A0"}</SheetDescription>
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
