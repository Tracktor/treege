import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectInputTypeProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const SelectInputType = ({ value, onValueChange }: SelectInputTypeProps) => (
  <SelectGroup>
    <SelectLabel>Type</SelectLabel>
    <Select value={value} onValueChange={onValueChange}>
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

export default SelectInputType;
