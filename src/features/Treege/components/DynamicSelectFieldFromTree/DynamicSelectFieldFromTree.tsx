import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@tracktor/design-system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useTreegeContext from "@/hooks/useTreegeContext";
import { getUuidsInTree } from "@/utils/tree";

interface DynamicSelectFieldFromTreeProps {
  value: string | null;
  onChange?: (event: SelectChangeEvent<string | undefined>, newValue: string | undefined) => void;
  currentUUID: string;
}

const filterNamesWithTwoPoints = (branchNames: string[]): string[] => branchNames.filter((name) => !name.includes(":"));

const DynamicSelectFieldFromTree = ({ value, onChange, currentUUID }: DynamicSelectFieldFromTreeProps) => {
  const { t } = useTranslation(["form"]);
  const { tree } = useTreegeContext();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || "");
  const treeNames = getUuidsInTree(tree);
  const filteredTreeNames = filterNamesWithTwoPoints(treeNames).filter((name) => name !== currentUUID);

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
        {filteredTreeNames.length ? (
          filteredTreeNames.map((name, index) => {
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
