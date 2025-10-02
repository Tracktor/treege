import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import InputNodeForm from "@/features/Treege/Forms/InputNodeForm";
import JsonNodeForm from "@/features/Treege/Forms/JsonNodeForm";
import UINodeForm from "@/features/Treege/Forms/UINodeForm";
import SelectNodeType from "@/features/Treege/Inputs/SelectNodeType";
import useFlow from "@/hooks/useFlow";

const NodeActionsSheets = () => {
  const { clearSelection, hasSelectedNode, selectedNode } = useFlow();

  return (
    <Sheet open={hasSelectedNode} onOpenChange={clearSelection}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit node</SheetTitle>
          <SheetDescription>{String(selectedNode?.data?.label || selectedNode?.data?.name || "")}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 flex-1 min-h-0">
          <SelectNodeType />
          {selectedNode?.type === "input" && <InputNodeForm />}
          {selectedNode?.type === "ui" && <UINodeForm />}
          {selectedNode?.type === "json" && <JsonNodeForm />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeActionsSheets;
