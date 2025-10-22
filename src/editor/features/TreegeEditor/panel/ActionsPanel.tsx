import { Panel, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { ArrowRightFromLine, Download, Plus, Save } from "lucide-react";
import { nanoid } from "nanoid";
import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { defaultNode } from "@/editor/constants/defaultNode";
import { useTreegeEditorContext } from "@/editor/context/TreegeEditorContext";
import useTranslate from "@/editor/hooks/useTranslate";
import { Button } from "@/shared/components/ui/button";
import { Flow } from "@/shared/types/node";

export interface ActionsPanelProps {
  onExportJson?: (data: Flow) => void;
  onSave?: (data: Flow) => void;
}

const uniqueId = nanoid();

const ActionsPanel = ({ onExportJson, onSave }: ActionsPanelProps) => {
  const { flowId, setFlowId } = useTreegeEditorContext();
  const { setNodes, setEdges, addNodes, screenToFlowPosition } = useReactFlow();
  const id = flowId || uniqueId;
  const nodes = useNodes();
  const edges = useEdges();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const t = useTranslate();

  const handleAddNode = () => {
    const centerX = (window.innerWidth || 0) / 2;
    const centerY = (window.innerHeight || 0) / 2;
    const nodeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--node-width"), 10);
    const nodeHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--node-height"), 10);
    const position = screenToFlowPosition({ x: centerX - nodeWidth, y: centerY - nodeHeight });

    addNodes([
      {
        ...defaultNode,
        id: nanoid(),
        position,
      },
    ]);
  };

  const handleImport = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        if (json && Array.isArray(json.nodes) && Array.isArray(json.edges)) {
          setNodes(json.nodes);
          setEdges(json.edges);
          toast.success(t("editor.actionsPanel.importSuccess"), {
            description: t("editor.actionsPanel.importSuccessDesc"),
          });
        } else {
          toast.error(t("editor.actionsPanel.invalidJson"), {
            description: t("editor.actionsPanel.invalidJsonDesc"),
          });
        }
      } catch (error) {
        toast.error(t("editor.actionsPanel.parseError"), {
          description: t("editor.actionsPanel.parseErrorDesc"),
        });
      }

      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = { edges, id, nodes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "treege.json";
    a.click();

    toast.success(t("editor.actionsPanel.downloadSuccess"), {
      description: t("editor.actionsPanel.downloadSuccessDesc"),
    });

    if (!flowId) {
      setFlowId?.(id);
    }

    onExportJson?.(data);
  };

  const handleSave = () => {
    if (!flowId) {
      setFlowId?.(id);
    }

    onSave?.({ edges, id, nodes });
  };

  return (
    <Panel position="top-right" className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleAddNode}>
        <Plus /> {t("editor.actionsPanel.addNode")}
      </Button>
      <Button variant="outline" size="sm" onClick={() => inputFileRef?.current?.click()}>
        <Download /> {t("editor.actionsPanel.importJson")}
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <ArrowRightFromLine /> {t("editor.actionsPanel.exportJson")}
      </Button>
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Save /> {t("common.save")}
      </Button>
      <input type="file" accept="application/json,.json" className="hidden" ref={inputFileRef} onChange={handleImport} />
    </Panel>
  );
};
export default ActionsPanel;
