import { ChangeEvent } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { filesToSerializable, fileToSerializable } from "@/renderer/utils/file";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultFileInput = ({ node, setValue, error }: InputRenderProps<"file">) => {
  const t = useTranslate();
  const name = node.data.name || node.id;

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
