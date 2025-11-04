import { InputRenderProps } from "@/renderer/types/renderer";
import { getInputAttributes } from "@/renderer/utils/node";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const DefaultTextAreaInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"textarea">) => {
  const inputAttributes = getInputAttributes(node);

  return (
    <FormItem className="mb-4">
      <Label htmlFor={inputAttributes.id}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        {...inputAttributes}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2"
        rows={4}
      />
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultTextAreaInput;
