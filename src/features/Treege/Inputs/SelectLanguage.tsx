import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = ["en", "fr", "es", "de", "ar", "it", "pt"];

export type Language = (typeof languages)[number];

export interface SelectLanguageProps {
  value?: Language;
  onValueChange?: (value: Language) => void;
}

const SelectLanguage = ({ value = "en", onValueChange }: SelectLanguageProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="uppercase">
      <SelectValue placeholder="" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {languages.map((type) => (
          <SelectItem key={type} value={type} className="uppercase">
            {type}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default SelectLanguage;
