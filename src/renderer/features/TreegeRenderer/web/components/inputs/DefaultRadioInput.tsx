import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

const DefaultRadioInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;
  const normalizedValue = value ? String(value) : "";

  return (
    <FormItem className="mb-4">
      <Label className="block text-sm font-medium mb-2">
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup value={normalizedValue} onValueChange={(val) => setFieldValue(fieldId, val)}>
        {node.data.options?.map((opt, index) => (
          <div key={opt.value + index} className="flex items-center space-x-2">
            <RadioGroupItem value={String(opt.value)} id={`${name}-${opt.value}`} disabled={opt.disabled} />
            <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
              {t(opt.label)}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultRadioInput;
