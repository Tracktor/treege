import { SelectChangeEvent, TextField } from "@tracktor/design-system";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import TreeSelect from "@/features/Treege/components/TreeSelect";

interface ExtraFieldProps {
  id: string;
  helperText: string;
  hiddenValue: string;
  isHiddenField: boolean;
  isTreeField: boolean;
  treeSelected: string;
  handleChangeTreeSelect(event: SelectChangeEvent<string>): void;
  handleChangeHelperText(event: ChangeEvent<HTMLInputElement>): void;
  handleChangeHiddenValue(event: ChangeEvent<HTMLInputElement>): void;
}

const ExtraField = ({
  id,
  helperText,
  hiddenValue,
  isHiddenField,
  isTreeField,
  treeSelected,
  handleChangeTreeSelect,
  handleChangeHelperText,
  handleChangeHiddenValue,
}: ExtraFieldProps) => {
  const { t } = useTranslation(["translation", "form"]);

  if (isTreeField) {
    return <TreeSelect required value={treeSelected} onChange={handleChangeTreeSelect} />;
  }

  if (isHiddenField) {
    return (
      <TextField
        required
        size="small"
        id={id}
        sx={{ flex: 1 }}
        label={t("hiddenValue", { ns: "form" })}
        onChange={handleChangeHiddenValue}
        value={hiddenValue}
      />
    );
  }

  return (
    <TextField sx={{ flex: 1 }} label={t("helperText", { ns: "form" })} size="small" onChange={handleChangeHelperText} value={helperText} />
  );
};

export default ExtraField;
