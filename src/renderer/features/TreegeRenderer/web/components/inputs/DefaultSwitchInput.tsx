import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultSwitchInput = ({ node, value, setValue, error }: InputRenderProps) => {
  const t = useTranslate();
  const name = node.data.name || node.id;

  return (
    <FormItem className="mb-4 flex items-center justify-between">
      <div>
        <Label htmlFor={name} className="block font-medium text-sm">
          {t(node.data.label) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
      </div>
      <Input
        type="checkbox"
        role="switch"
        id={name}
        name={name}
        checked={value}
        onChange={(e) => setValue(e.target.checked)}
        className="ml-4"
      />
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export default DefaultSwitchInput;
