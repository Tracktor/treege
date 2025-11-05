import { InputRenderProps } from "@/renderer/types/renderer";
import { Input } from "@/shared/components/ui/input";

const DefaultHiddenInput = ({ value, name, id }: InputRenderProps<"hidden">) => {
  return <Input type="hidden" id={id} name={name} value={value ?? ""} />;
};

export default DefaultHiddenInput;
