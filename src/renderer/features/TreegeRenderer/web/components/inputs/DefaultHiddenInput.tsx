import { InputRenderProps } from "@/renderer/types/renderer";
import { Input } from "@/shared/components/ui/input";

const DefaultHiddenInput = ({ node, value }: InputRenderProps) => {
  const name = node.data.name || node.id;
  return <Input type="hidden" name={name} value={value ?? ""} />;
};

export default DefaultHiddenInput;
