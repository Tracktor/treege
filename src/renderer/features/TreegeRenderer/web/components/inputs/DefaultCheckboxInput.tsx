import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";

const DefaultCheckboxInput = ({ node, value, setValue, error }: InputRenderProps) => {
  const t = useTranslate();
  const name = node.data.name || node.id;

  // If there are options, render a checkbox group (multiple checkboxes)
  if (node.data.options && node.data.options.length > 0) {
    const selectedValues = Array.isArray(value) ? value.map(String) : [];

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      const newValues = checked ? [...selectedValues, optionValue] : selectedValues.filter((v) => v !== optionValue);
      setValue(newValues);
    };

    return (
      <FormItem className="mb-4">
        <Label className="mb-2 block font-medium text-sm">
          {t(node.data.label) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="space-y-2">
          {node.data.options.map((option, index) => (
            <div key={option.value + index} className="flex items-center gap-3">
              <Checkbox
                id={`${name}-${option.value}`}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={(checked) => handleCheckboxChange(String(option.value), checked as boolean)}
                disabled={option.disabled}
              />
              <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer font-normal text-sm">
                {t(option.label) ? t(option.label) : option.value}
              </Label>
            </div>
          ))}
        </div>
        {error && <FormError>{error}</FormError>}
        {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
      </FormItem>
    );
  }

  // Single checkbox (no options)
  return (
    <FormItem className="mb-4">
      <div className="flex items-center gap-3">
        <Checkbox id={name} checked={value} onCheckedChange={(checked) => setValue(checked)} />
        <div className="grid gap-2">
          <Label htmlFor={name} className="cursor-pointer font-medium text-sm">
            {t(node.data.label) || node.data.name}
            {node.data.required && <span className="text-red-500">*</span>}
          </Label>
          {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
        </div>
      </div>
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export default DefaultCheckboxInput;
