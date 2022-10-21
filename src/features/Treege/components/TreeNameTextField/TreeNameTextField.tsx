import { TextField } from "design-system-tracktor";
import { useTranslation } from "react-i18next";
import useTreeNameTextField from "@/features/Treege/components/TreeNameTextField/useTreeNameTextField";

const TreeNameTextField = () => {
  const { t } = useTranslation("form");
  const { name, handleChangeName, errorName } = useTreeNameTextField();

  return (
    <TextField
      required
      label={t("treeName")}
      size="small"
      onChange={handleChangeName}
      value={name}
      error={!!errorName}
      helperText={errorName}
    />
  );
};

export default TreeNameTextField;