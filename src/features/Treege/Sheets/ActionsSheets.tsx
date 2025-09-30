import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import NodeForm from "@/features/Treege/Form/NodeForm";
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

        <NodeForm />
      </SheetContent>
    </Sheet>
  );
};

export default ActionsSheets;
