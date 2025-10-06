import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import nodeTypes from "@/constants/nodeTypes";
import useFlow from "@/hooks/useFlow";

const SelectNodeType = () => {
  const { updateSelectedNodeType, selectedNode } = useFlow();
  const value = selectedNode?.type || "";
  const isGroupNode = selectedNode?.type === "group";

  return (
    <SelectGroup>
      <SelectLabel>Node Type</SelectLabel>
      <Select value={value} onValueChange={(newValue) => updateSelectedNodeType(newValue)} disabled={isGroupNode}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Node Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.keys(nodeTypes)
              .filter((type) => (isGroupNode ? type === "group" : type !== "group"))
              .map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </SelectGroup>
  );
};

export default SelectNodeType;
