import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const inputType = [
  "address",
  "autocomplete",
  "checkbox",
  "date",
  "dateRange",
  "daterange",
  "file",
  "hidden",
  "http",
  "number",
  "password",
  "radio",
  "select",
  "switch",
  "text",
  "time",
  "timeRange",
] as const;

export type InputType = (typeof inputType)[number];

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
