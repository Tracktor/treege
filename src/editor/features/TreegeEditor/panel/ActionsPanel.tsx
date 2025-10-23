import { Panel, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { ArrowRightFromLine, Copy, Download, EllipsisVertical, Plus, Save } from "lucide-react";
import { nanoid } from "nanoid";
import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { defaultNode } from "@/editor/constants/defaultNode";
import { useTreegeEditorContext } from "@/editor/context/TreegeEditorContext";
import useTranslate from "@/editor/hooks/useTranslate";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success(t("editor.actionsPanel.idCopied"), {
        description: id,
      });
    } catch {
      toast.error(t("editor.actionsPanel.copyFailed"));
    }
  };

  return (
    <Panel position="top-right" className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleAddNode}>
        <Plus /> {t("editor.actionsPanel.addNode")}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Treege ID</span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                type="button"
              >
                <Copy className="h-3 w-3" />
                <span className="truncate">{id}</span>
              </button>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => inputFileRef?.current?.click()}>
              <Download /> {t("editor.actionsPanel.importJson")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <ArrowRightFromLine /> {t("editor.actionsPanel.exportJson")}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSave}>
              <Save /> {t("common.save")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <input type="file" accept="application/json,.json" className="hidden" ref={inputFileRef} onChange={handleImport} />
    </Panel>
  );
};
export default ActionsPanel;
