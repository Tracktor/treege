import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFlow from "@/hooks/useFlow";

const SelectInputType = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();
  const value = selectedNode?.data?.type ? String(selectedNode?.data?.type) : "text";

  return (
    <SelectGroup>
      <SelectLabel>Type</SelectLabel>
      <Select value={value} onValueChange={(newValue) => updateSelectedNodeData({ type: newValue })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="autocomplete">Autocomplete</SelectItem>
            <SelectItem value="http">HTTP</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </SelectGroup>
  );
};

export default SelectInputType;
