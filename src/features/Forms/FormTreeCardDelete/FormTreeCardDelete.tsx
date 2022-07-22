import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import useFormTreeCardDelete from "@/features/Forms/FormTreeCardDelete/useFormTreeCardDelete";

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
        <Button variant="contained" color="warning" type="submit">
          {t("remove")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardDelete;
