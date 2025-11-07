import { useMemo } from "react";
import ComboboxWithCreate, { ComboboxOption } from "@/editor/components/input/ComboboxWithCreate";
import { PATTERN } from "@/shared/constants/pattern";

interface ComboboxPatternProps {
  value?: string | null;
  onValueChange?: (newValue: string) => void;
  id?: string;
}

const defaultPatterns: ComboboxOption[] = Object.entries(PATTERN).map(([key, val]) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
  value: val,
}));

const ComboboxPattern = ({ id, value, onValueChange }: ComboboxPatternProps) => {
  const allOptions = useMemo(() => {
    if (value && !defaultPatterns.some((option) => option.value === value)) {
      return [
        ...defaultPatterns,
        {
          label: `Custom: ${value}`,
          value,
        },
      ];
    }
    return defaultPatterns;
  }, [value]);

  return (
    <ComboboxWithCreate
      id={id}
      options={allOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder="Select or create a pattern"
      searchPlaceholder="Search patterns..."
      createLabel={(query) => `Use pattern: ${query}`}
    />
  );
};

export default ComboboxPattern;
