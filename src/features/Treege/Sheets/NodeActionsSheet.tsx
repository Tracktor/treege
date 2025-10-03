import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import FlowNodeForm from "@/features/Treege/Forms/FlowNodeForm";
import InputNodeForm from "@/features/Treege/Forms/InputNodeForm";
import JsonNodeForm from "@/features/Treege/Forms/JsonNodeForm";
import UINodeForm from "@/features/Treege/Forms/UINodeForm";
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
            {selectedNode?.id}
            {!!selectedNode?.id && (!!selectedNode?.data?.label || !!selectedNode?.data?.name) && " - "}
            {String(selectedNode?.data?.label || selectedNode?.data?.name || "")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col px-4 flex-1 min-h-0">
          <SelectNodeType />

          <Separator className="mt-8 mb-5" />

          {selectedNode?.type === "input" && <InputNodeForm />}
          {selectedNode?.type === "ui" && <UINodeForm />}
          {selectedNode?.type === "json" && <JsonNodeForm />}
          {selectedNode?.type === "flow" && <FlowNodeForm />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeActionsSheet;
