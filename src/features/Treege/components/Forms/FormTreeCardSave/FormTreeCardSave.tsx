import { Button, Stack, TextField } from "design-system-tracktor";
import { useTranslation } from "react-i18next";
import useFormTreeCardSave from "@/features/Treege/components/Forms/FormTreeCardSave/useFormTreeCardSave";

interface FormTreeCardSaveProps {
  onClose?(): void;
}

const FormTreeCardSave = ({ onClose }: FormTreeCardSaveProps) => {
  const { t } = useTranslation();
  const { handleSubmit, label, handleChangeLabel } = useFormTreeCardSave();

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
        <TextField sx={{ flex: 1 }} label={t("label", { ns: "form" })} onChange={handleChangeLabel} value={label} required />
      </Stack>

      <Stack spacing={2} py={1} direction="row" justifyContent="flex-end">
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" color="primary" type="submit">
          {t("save")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardSave;
