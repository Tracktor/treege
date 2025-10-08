import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const inputType = {
  address: "address",
  autocomplete: "autocomplete",
  checkbox: "checkbox",
  date: "date",
  dateRange: "dateRange",
  daterange: "daterange",
  file: "file",
  hidden: "hidden",
  http: "http",
  number: "number",
  password: "password",
  radio: "radio",
  select: "select",
  switch: "switch",
  text: "text",
  time: "time",
  timeRange: "timeRange",
};

export type InputType = (typeof inputType)[keyof typeof inputType];

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
