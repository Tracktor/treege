import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import useFormTreeCardDelete from "@/features/Forms/FormTreeCardDelete/useFormTreeCardDelete";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardDelete = ({ onClose }: FormTreeCardMutationProps) => {
  const { t, i18n } = useTranslation();
  const { handleSubmit } = useFormTreeCardDelete();

  console.log(i18n.language);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" color="warning" type="submit">
          {t("remove")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardDelete;
