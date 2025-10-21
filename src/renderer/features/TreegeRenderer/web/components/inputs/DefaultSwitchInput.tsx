import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultSwitchInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4 flex items-center justify-between">
      <div>
        <Label htmlFor={name} className="block text-sm font-medium">
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
        checked={value || false}
        onChange={(e) => setFieldValue(fieldId, e.target.checked)}
        className="ml-4"
      />
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export default DefaultSwitchInput;
