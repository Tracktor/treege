import { PlusCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFlow from "@/hooks/useFlow";

const SelectNodeGroup = () => {
  const [newGroupLabel, setNewGroupLabel] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { selectedNode, groupNodes, setNodes } = useFlow();
  const currentParentId = selectedNode?.parentId || "none";

  const handleGroupChange = (parentId: string) => {
    if (!selectedNode) return;

    setNodes((nds) => {
      if (parentId === "none") {
        return nds.map((node) => {
          if (node.id === selectedNode.id) {
            const { parentId: parentIdDeleted, extent, ...rest } = node;
            return rest;
          }
          return node;
        });
      }

      const groupNode = nds.find((n) => n.id === parentId);
      if (!groupNode) return nds;

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
    if (!newGroupLabel.trim() || !selectedNode) {
      return;
    }

    const existingGroup = groupNodes.find((node) => String(node.data?.label).toLowerCase() === newGroupLabel.trim().toLowerCase());

    if (existingGroup) {
      toast.error("This group already exists", {
        description: "Use the selector to add the node to an existing group.",
      });
      return;
    }

    const newGroupId = nanoid();

    setNodes((nds) => {
      const newGroupNode = {
        data: { label: newGroupLabel.trim() },
        id: newGroupId,
        position: {
          x: selectedNode.position.x - 50,
          y: selectedNode.position.y - 80,
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
              x: 50,
              y: 80,
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
      <Label>Group (optional)</Label>
      <div className="flex gap-2">
        <Select value={currentParentId} onValueChange={handleGroupChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="No group" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">No group</SelectItem>
              {groupNodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.data?.label ? String(node.data?.label) : node.id}
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
                <p className="text-sm text-muted-foreground">The group will be created around the selected node.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-label">Group name</Label>
                <Input
                  id="group-label"
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
              <div className="flex gap-2 justify-end">
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
