import { useMemo } from "react";
import ComboboxWithCreate, { ComboboxOption } from "@/components/inputs/ComboboxWithCreate";
import pattern from "@/constants/pattern";

interface ComboboxPatternProps {
  value?: string | null;
  onValueChange?: (newValue: string) => void;
}

const ComboboxPattern = ({ value, onValueChange }: ComboboxPatternProps) => {
  const defaultPatterns: ComboboxOption[] = Object.entries(pattern).map(([key, val]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
    value: val,
  }));

  // Add current value as custom option if it's not in default patterns
  const allOptions = useMemo(() => {
    if (value && !defaultPatterns.some((opt) => opt.value === value)) {
      return [
        ...defaultPatterns,
        {
          label: `Custom: ${value}`,
          value,
        },
      ];
    }
    return defaultPatterns;
  }, [defaultPatterns, value]);

  return (
    <ComboboxWithCreate
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
