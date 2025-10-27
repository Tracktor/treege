import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

const DefaultRadioInput = ({ node, value, setValue, error }: InputRenderProps<"radio">) => {
  const t = useTranslate();
  const name = node.data.name || node.id;
  const normalizedValue = value ? String(value) : "";

  return (
    <FormItem className="mb-4">
      <Label className="mb-2 block font-medium text-sm">
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup value={normalizedValue} onValueChange={(val) => setValue(val)}>
        {node.data.options?.map((option, index) => (
          <div key={option.value + index} className="flex items-center space-x-2">
            <RadioGroupItem value={String(option.value)} id={`${name}-${option.value}`} disabled={option.disabled} />
            <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer font-normal text-sm">
              {t(option.label) ? t(option.label) : option.value}
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
