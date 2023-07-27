import { Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import useFieldsSelect from "@/features/Treege/components/FieldsSelect/useFieldsSelect";
import type { TreeNodeField } from "@/features/Treege/type/TreeNode";

interface FieldsSelectProps {
  value: TreeNodeField["type"];
  onChange?: (event: SelectChangeEvent<TreeNodeField["type"]>) => void;
}

const FieldsSelect = ({ onChange, value }: FieldsSelectProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { fields } = useFieldsSelect();

  return (
    <FormControl sx={{ flex: 1 }} required>
      <InputLabel>{t("type")}</InputLabel>
      <Select
        value={value}
        label={t("type")}
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 300 },
          },
        }}
      >
        {fields.map(({ type, isDecisionField }) => (
          <MenuItem key={type} value={type}>
            {t(`type.${type}`, { ns: "form" })}
            {isDecisionField && <Chip label={t("decisionFields", { ns: "form" })} size="small" />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FieldsSelect;
