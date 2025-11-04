import { InputRenderProps } from "@/renderer/types/renderer";
import { getInputAttributes } from "@/renderer/utils/node";
import { Input } from "@/shared/components/ui/input";

const DefaultHiddenInput = ({ node, value }: InputRenderProps<"hidden">) => {
  const inputAttributes = getInputAttributes(node);
  return <Input type="hidden" {...inputAttributes} value={value ?? ""} />;
};

export default DefaultHiddenInput;
