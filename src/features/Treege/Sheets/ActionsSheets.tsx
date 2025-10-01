import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import InputNodeForm from "@/features/Treege/Forms/InputNodeForm";
import SelectNodeType from "@/features/Treege/Inputs/SelectNodeType";
import useFlow from "@/hooks/useFlow";

const ActionsSheets = () => {
  const { clearSelection, hasSelectedNode, selectedNode } = useFlow();

  return (
    <Sheet open={hasSelectedNode} onOpenChange={clearSelection}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit node</SheetTitle>
          <SheetDescription>{String(selectedNode?.data?.label || selectedNode?.data?.name || "")}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 px-4">
          <SelectNodeType />
          {selectedNode?.type === "input" && <InputNodeForm />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionsSheets;
