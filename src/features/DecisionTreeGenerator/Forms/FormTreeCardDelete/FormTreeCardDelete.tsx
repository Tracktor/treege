import { Button, Stack } from "design-system-tracktor";
import { useTranslation } from "react-i18next";
import useFormTreeCardDelete from "@/features/DecisionTreeGenerator/Forms/FormTreeCardDelete/useFormTreeCardDelete";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardDelete = ({ onClose }: FormTreeCardMutationProps) => {
  const { t } = useTranslation();
  const { handleSubmit } = useFormTreeCardDelete();

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" color="error" type="submit">
          {t("remove")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardDelete;
