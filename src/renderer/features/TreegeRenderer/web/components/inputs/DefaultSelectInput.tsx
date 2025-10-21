import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const DefaultSelectInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;
  const normalizedValue = value === null ? "" : String(value);

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={normalizedValue} onValueChange={(val) => setFieldValue(fieldId, val)}>
        <SelectTrigger>
          <SelectValue placeholder={t(node.data.placeholder) || ""} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {node.data.options?.map((opt, index) => (
              <SelectItem key={`${opt.value}-${index}`} value={String(opt.value)} disabled={opt.disabled}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultSelectInput;
