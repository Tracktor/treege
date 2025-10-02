import { Panel } from "@xyflow/react";
import { ArrowRightFromLine, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionsPanel = () => (
  <Panel position="top-right" className="flex gap-2">
    <Button variant="outline" size="sm">
      <Download /> Import Json
    </Button>
    <Button variant="outline" size="sm">
      <ArrowRightFromLine /> Export Json
    </Button>
  </Panel>
);

export default ActionsPanel;
