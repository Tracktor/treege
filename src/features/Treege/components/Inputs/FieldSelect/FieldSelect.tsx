import { Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import useFieldSelect from "@/features/Treege/components/Inputs/FieldSelect/useFieldSelect";
import type { TreeNodeField } from "@/features/Treege/type/TreeNode";

interface FieldsSelectProps {
  id: string;
  value: TreeNodeField["type"];
  onChange?: (event: SelectChangeEvent<TreeNodeField["type"]>) => void;
}

const FieldSelect = ({ id, onChange, value }: FieldsSelectProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { fields } = useFieldSelect();

  return (
    <FormControl sx={{ flex: 1 }} required fullWidth>
      <InputLabel id="typeLabel">{t("type")}</InputLabel>
      <Select
        id={id}
        labelId="typeLabel"
        variant="outlined"
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
            {isDecisionField && <Chip label={t("decisionField", { ns: "form" })} size="small" color="info" sx={{ marginLeft: 1 }} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FieldSelect;
