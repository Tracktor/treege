import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";

const DefaultCheckboxInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  // If there are options, render a checkbox group (multiple checkboxes)
  if (node.data.options && node.data.options.length > 0) {
    const selectedValues = Array.isArray(value) ? value.map(String) : [];

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      const newValues = checked ? [...selectedValues, optionValue] : selectedValues.filter((v) => v !== optionValue);
      setFieldValue(fieldId, newValues);
    };

    return (
      <FormItem className="mb-4">
        <Label className="block text-sm font-medium mb-2">
          {t(node.data.label) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="space-y-2">
          {node.data.options.map((opt, index) => (
            <div key={opt.value + index} className="flex items-center gap-3">
              <Checkbox
                id={`${name}-${opt.value}`}
                checked={selectedValues.includes(String(opt.value))}
                onCheckedChange={(checked) => handleCheckboxChange(String(opt.value), checked as boolean)}
                disabled={opt.disabled}
              />
              <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
                {t(opt.label)}
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
        <Checkbox id={name} checked={value} onCheckedChange={(checked) => setFieldValue(fieldId, checked)} />
        <div className="grid gap-2">
          <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
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
