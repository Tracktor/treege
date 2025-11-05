import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
import { InputRenderProps } from "@/renderer/types/renderer";

/**
 * Default submit input renderer
 * Wraps DefaultSubmitButton to adapt InputRenderProps to SubmitButtonProps
 */
const DefaultSubmitInput = ({ label }: InputRenderProps<"submit">) => {
  return <DefaultSubmitButton label={label} />;
};

export default DefaultSubmitInput;
