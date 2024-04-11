import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@tracktor/design-system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useTreegeContext from "@/hooks/useTreegeContext";
import { getAllAncestorNamesFromTree } from "@/utils/tree";

interface DynamicSelectFieldFromTreeProps {
  value: string | null;
  onChange?: (event: SelectChangeEvent<string | undefined>, newValue: string | undefined) => void;
}

const DynamicSelectFieldFromTree = ({ value, onChange }: DynamicSelectFieldFromTreeProps) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || "");
  const { t } = useTranslation(["form"]);
  const { tree, currentHierarchyPointNode } = useTreegeContext();
  const { uuid } = currentHierarchyPointNode?.data || {};
  const ancestorsName = getAllAncestorNamesFromTree(tree, uuid);

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const newValue = event.target.value;

    setSelectedValue(newValue);
    onChange?.(event, newValue);
  };

  return (
    <FormControl sx={{ flex: 1.5 }} required>
      <InputLabel>{t("form:ancestor")}</InputLabel>
      <Select
        sx={{ flex: 2 }}
        value={selectedValue}
        label={t("form:ancestor")}
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 300 },
          },
        }}
      >
        {ancestorsName.length ? (
          ancestorsName.map((name, index) => {
            const key = `${name}-${index}`;

            return (
              <MenuItem key={key} value={name}>
                {name}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem disabled value="">
            {t("form:noAncestorFound")}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default DynamicSelectFieldFromTree;
