import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFlow from "@/hooks/useFlow";

const SelectNodeType = () => {
  const { updateSelectedNodeType, selectedNode } = useFlow();
  const value = selectedNode?.type || "";

  return (
    <SelectGroup>
      <SelectLabel>Node Type</SelectLabel>
      <Select value={value} onValueChange={(newValue) => updateSelectedNodeType(newValue)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Node Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="input">Input</SelectItem>
            <SelectItem value="ui">UI</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </SelectGroup>
  );
};

export default SelectNodeType;
