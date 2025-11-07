import { useTreegeConfig } from "@/renderer";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButton";
import DefaultSubmitButtonWrapper from "@/renderer/features/TreegeRenderer/web/components/DefaultSubmitButtonWrapper";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultSubmitInput = ({ missingRequiredFields, isSubmitting, label }: InputRenderProps<"submit">) => {
  const config = useTreegeConfig();
  const submitButton = config?.components?.submitButton;
  const submitButtonWrapper = config?.components?.submitButtonWrapper;
  const SubmitButton = submitButton || DefaultSubmitButton;
  const SubmitButtonWrapper = submitButtonWrapper || DefaultSubmitButtonWrapper;

  return (
    <SubmitButtonWrapper missingFields={missingRequiredFields}>
      <SubmitButton label={label} disabled={isSubmitting} />
    </SubmitButtonWrapper>
  );
};

export default DefaultSubmitInput;
