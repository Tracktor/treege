import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultNumberInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"number">) => {
  const name = node.data.name || node.id;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))}
        placeholder={placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultNumberInput;
