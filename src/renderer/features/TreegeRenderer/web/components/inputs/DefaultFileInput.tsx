import { ChangeEvent } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultFileInput = ({ node }: InputRenderProps) => {
  const { setFieldValue, formErrors } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      setFieldValue(fieldId, undefined);
      return;
    }

    // If multiple files are allowed, store as array, otherwise store single file
    if (node.data.multiple) {
      setFieldValue(fieldId, Array.from(files));
    } else {
      setFieldValue(fieldId, files[0]);
    }
  };

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        multiple={node.data.multiple}
        placeholder={t(node.data.placeholder)}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultFileInput;
