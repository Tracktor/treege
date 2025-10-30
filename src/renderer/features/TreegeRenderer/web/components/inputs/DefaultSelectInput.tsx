import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const DefaultSelectInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"select">) => {
  const t = useTranslate();
  const name = node.data.name || node.id;
  const normalizedValue = value ? String(value) : "";

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={normalizedValue} onValueChange={(val) => setValue(val)}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder={placeholder || t("renderer.defaultSelectInput.selectOption")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {node.data.options?.map((option, index) => {
              return (
                <SelectItem key={`${option.value}-${index}`} value={String(option.value)} disabled={option.disabled}>
                  {t(option.label) ? t(option.label) : option.value}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultSelectInput;
