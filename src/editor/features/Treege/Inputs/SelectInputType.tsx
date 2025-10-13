import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import inputType from "@/shared/constants/inputType";
import { InputType } from "@/shared/types/input";

export interface SelectInputTypeProps {
  value?: InputType;
  onValueChange?: (value: InputType) => void;
}

const SelectInputType = ({ value, onValueChange }: SelectInputTypeProps) => (
  <SelectGroup>
    <SelectLabel>Type</SelectLabel>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full capitalize">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.values(inputType).map((type) => (
            <SelectItem key={type} value={type} className="capitalize">
              {type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </SelectGroup>
);

export default SelectInputType;
