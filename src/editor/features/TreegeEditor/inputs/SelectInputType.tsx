import useTranslate from "@/editor/hooks/useTranslate";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { INPUT_TYPE } from "@/shared/constants/inputType";
import { InputType } from "@/shared/types/node";

export interface SelectInputTypeProps {
  value?: InputType;
  onValueChange?: (value: InputType) => void;
}

const SelectInputType = ({ value, onValueChange }: SelectInputTypeProps) => {
  const t = useTranslate();

  return (
    <SelectGroup>
      <SelectLabel>{t("editor.selectInputType.type:")}</SelectLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full capitalize">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.values(INPUT_TYPE).map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </SelectGroup>
  );
};

export default SelectInputType;
