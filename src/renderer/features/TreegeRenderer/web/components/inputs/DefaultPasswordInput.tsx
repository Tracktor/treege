import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultPasswordInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"password">) => {
  const name = node.data.name || node.id;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="password"
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultPasswordInput;
