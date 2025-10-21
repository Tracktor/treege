import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Input } from "@/shared/components/ui/input";

const DefaultHiddenInput = ({ node }: InputRenderProps) => {
  const { formValues } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const name = node.data.name || fieldId;
  return <Input type="hidden" name={name} value={value ?? ""} />;
};

export default DefaultHiddenInput;
