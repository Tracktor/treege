import { ChangeEvent } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { filesToSerializable, fileToSerializable } from "@/renderer/utils/file";
import { getInputAttributes } from "@/renderer/utils/node";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultFileInput = ({ node, setValue, error, label, placeholder, helperText }: InputRenderProps<"file">) => {
  const inputAttributes = getInputAttributes(node);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      setValue(null);
      return;
    }

    // Convert File objects to serializable format
    if (node.data.multiple) {
      const serializableFiles = await filesToSerializable(Array.from(files));
      setValue(serializableFiles);
      return;
    }

    const serializableFile = await fileToSerializable(files[0]);
    setValue(serializableFile);
  };

  return (
    <FormItem className="mb-4">
      <Label htmlFor={inputAttributes.id}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input type="file" {...inputAttributes} onChange={handleFileChange} multiple={node.data.multiple} placeholder={placeholder} />
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultFileInput;
