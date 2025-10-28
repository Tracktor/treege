import FlowNodeForm from "@/editor/features/TreegeEditor/forms/FlowNodeForm";
import GroupNodeForm from "@/editor/features/TreegeEditor/forms/GroupNodeForm";
import InputNodeForm from "@/editor/features/TreegeEditor/forms/InputNodeForm";
import UINodeForm from "@/editor/features/TreegeEditor/forms/UINodeForm";
import SelectNodeGroup from "@/editor/features/TreegeEditor/inputs/SelectNodeGroup";
import SelectNodeType from "@/editor/features/TreegeEditor/inputs/SelectNodeType";
import useFlowActions from "@/editor/hooks/useFlowActions";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import useTranslate from "@/editor/hooks/useTranslate";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { TreegeNodeData } from "@/shared/types/node";
import { isFlowNode, isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";

const NodeActionsSheet = () => {
  const { selectedNode, hasSelectedNodes } = useNodesSelection<TreegeNodeData>();
  const { clearSelection } = useFlowActions();
  const translate = useTranslate();
  const label = translate(selectedNode?.data?.label);

  return (
    <Sheet open={hasSelectedNodes} onOpenChange={clearSelection}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Edit node <span className="font-light text-muted-foreground text-xs">{selectedNode?.id}</span>
          </SheetTitle>
          <SheetDescription>{label || "\u00A0"}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="space-y-6">
            <SelectNodeType />
            <SelectNodeGroup />

            <Separator />

            {isInputNode(selectedNode) && <InputNodeForm />}
            {isUINode(selectedNode) && <UINodeForm />}
            {isFlowNode(selectedNode) && <FlowNodeForm />}
            {isGroupNode(selectedNode) && <GroupNodeForm />}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NodeActionsSheet;
