import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import FlowNodeForm from "@/features/Treege/Forms/FlowNodeForm";
import GroupNodeForm from "@/features/Treege/Forms/GroupNodeForm";
import InputNodeForm from "@/features/Treege/Forms/InputNodeForm";
import JsonNodeForm from "@/features/Treege/Forms/JsonNodeForm";
import UINodeForm from "@/features/Treege/Forms/UINodeForm";
import SelectNodeGroup from "@/features/Treege/Inputs/SelectNodeGroup";
import SelectNodeType from "@/features/Treege/Inputs/SelectNodeType";
import useFlow from "@/hooks/useFlow";

const NodeActionsSheet = () => {
  const { clearSelection, hasSelectedNode, selectedNode } = useFlow();

  return (
    <Sheet open={hasSelectedNode} onOpenChange={clearSelection}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit node</SheetTitle>
          <SheetDescription>
            {String(selectedNode?.data?.label || selectedNode?.data?.name || "")}
            {!!selectedNode?.id && (!!selectedNode?.data?.label || !!selectedNode?.data?.name) && " - "}
            {selectedNode?.id}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col px-4 flex-1 min-h-0 space-y-6 pt-6">
          <SelectNodeType />
          <SelectNodeGroup />

          <Separator />

          {selectedNode?.type === "input" && <InputNodeForm />}
          {selectedNode?.type === "ui" && <UINodeForm />}
          {selectedNode?.type === "json" && <JsonNodeForm />}
          {selectedNode?.type === "flow" && <FlowNodeForm />}
          {selectedNode?.type === "group" && <GroupNodeForm />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeActionsSheet;
