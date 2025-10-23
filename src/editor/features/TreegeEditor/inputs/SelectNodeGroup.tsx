import { useReactFlow } from "@xyflow/react";
import { PlusCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useId, useState } from "react";
import { toast } from "sonner";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import useTranslate from "@/editor/hooks/useTranslate";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { isGroupNode } from "@/shared/utils/nodeTypeGuards";

const SelectNodeGroup = () => {
  const inputId = useId();
  const [newGroupLabel, setNewGroupLabel] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { selectedNode, groupNodes } = useNodesSelection();
  const { setNodes } = useReactFlow();
  const currentParentId = selectedNode?.parentId || "none";
  const isGroup = isGroupNode(selectedNode);
  const t = useTranslate();

  if (isGroup) {
    return null;
  }

  const handleGroupChange = (parentId: string) => {
    if (!selectedNode) {
      return;
    }

    setNodes((nds) => {
      if (parentId === "none") {
        return nds.map((node) => {
          if (node.id === selectedNode.id) {
            const { ...rest } = node;
            return rest;
          }
          return node;
        });
      }

      const groupNode = nds.find((n) => n.id === parentId);
      if (!groupNode) {
        return nds;
      }

      return nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            extent: "parent" as const,
            parentId,
            position: {
              x: 50,
              y: 80,
            },
          };
        }
        return node;
      });
    });
  };

  const handleCreateGroup = () => {
    if (!(newGroupLabel.trim() && selectedNode)) {
      return;
    }

    const existingGroup = groupNodes.find((node) => {
      const label = node.data?.label?.en || node.data?.label;
      return String(label).toLowerCase() === newGroupLabel.trim().toLowerCase();
    });

    if (existingGroup) {
      toast.error("This group already exists", {
        description: "Use the selector to add the node to an existing group.",
      });
      return;
    }

    const newGroupId = nanoid();

    setNodes((nds) => {
      const newGroupNode = {
        data: {
          label: {
            en: newGroupLabel.trim(),
          },
        },
        id: newGroupId,
        position: {
          x: selectedNode.position.x - 300,
          y: selectedNode.position.y,
        },
        style: {
          height: 400,
          width: 600,
        },
        type: "group",
      };

      // Parent nodes must be before their children in the nodes array
      const updatedNodes = nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            extent: "parent" as const,
            parentId: newGroupId,
            position: {
              x: 175,
              y: 30,
            },
          };
        }
        return node;
      });

      return [newGroupNode, ...updatedNodes];
    });

    setNewGroupLabel("");
    setPopoverOpen(false);

    toast.success("Group created", {
      description: `The group "${newGroupLabel.trim()}" has been created successfully.`,
    });
  };

  return (
    <div className="space-y-2">
      <Label>{t("editor.selectNodeGroup.group")}</Label>
      <div className="flex gap-2">
        <Select value={currentParentId} onValueChange={handleGroupChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={t("editor.selectNodeGroup.noGroup")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">{t("editor.selectNodeGroup.noGroup")}</SelectItem>
              {groupNodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.data.label?.en ? String(node.data.label?.en) : node.id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" title="Create a new group">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">New group</h4>
                <p className="text-muted-foreground text-sm">The group will be created around the selected node.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${inputId}-group-label`}>Group name</Label>
                <Input
                  id={`${inputId}-group-label`}
                  value={newGroupLabel}
                  onChange={(e) => setNewGroupLabel(e.target.value)}
                  placeholder="Ex: Step 1 - Personal info"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateGroup();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setPopoverOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateGroup} disabled={!newGroupLabel.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SelectNodeGroup;
