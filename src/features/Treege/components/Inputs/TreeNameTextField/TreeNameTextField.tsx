import { TextField } from "design-system-tracktor";
import { useTranslation } from "react-i18next";

const TreeNameTextField = () => {
  const { t } = useTranslation("form");

  return (
    <TextField
      required
      id="standard-basic"
      label={t("treeName")}
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

export default TreeNameTextField;
