import { Typography, Select, MenuItem, Stack, SelectChangeEvent } from "@tracktor/design-system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useTreegeContext from "@/hooks/useTreegeContext";
import { getAllAncestorNamesFromTree, getTree } from "@/utils/tree";

interface ReceiveValueFromParentProps {
  id: string;
  value: string | null;
  onChange?: (event: SelectChangeEvent<string | undefined>, newValue: string | undefined) => void;
  onSelectValue?: (value: boolean) => void;
}

const ReceiveValueFromAncestor = ({ value, onChange, id, onSelectValue }: ReceiveValueFromParentProps) => {
  const { t } = useTranslation(["form"]);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || "");
  const { tree, treePath, currentHierarchyPointNode } = useTreegeContext();
  const { uuid } = currentHierarchyPointNode?.data || {};
  const currentTree = getTree(tree, treePath?.at(-1)?.path);
  const ancestorsName = getAllAncestorNamesFromTree(currentTree, uuid);

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const newValue = event.target.value;

    setSelectedValue(newValue);

    onSelectValue?.(!!newValue);
    onChange?.(event, newValue);
  };

  return (
    <Stack spacing={1} pb={2}>
      <Typography variant="body2" pb={1} sx={{ textDecoration: "underline" }}>
        {t("receiveValueFromParent")}
      </Typography>
      <Select
        id={id}
        variant="outlined"
        size="xSmall"
        value={selectedValue}
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
    </Stack>
  );
};

export default ReceiveValueFromAncestor;
