import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "design-system-tracktor";
import { useTranslation } from "react-i18next";
import useFieldsSelect from "@/features/Treege/components/FieldsSelect/useFieldsSelect";
import type { TreeNodeField } from "@/features/Treege/type/TreeNode";

interface FieldsSelectProps {
  value: TreeNodeField["type"];
  onChange?: (event: SelectChangeEvent<TreeNodeField["type"]>) => void;
}

const FieldsSelect = ({ onChange, value }: FieldsSelectProps) => {
  const { t } = useTranslation();
  const { fields } = useFieldsSelect();

  return (
    <FormControl sx={{ flex: 1 }} required>
      <InputLabel>{t("type")}</InputLabel>
      <Select value={value} label={t("type")} onChange={onChange} MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}>
        {fields.map(({ type: fieldsType }) => (
          <MenuItem key={fieldsType} value={fieldsType}>
            {t(`type.${fieldsType}`, { ns: "form" })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FieldsSelect;
