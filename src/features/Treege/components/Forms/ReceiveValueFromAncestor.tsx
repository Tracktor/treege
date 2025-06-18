import { Typography, Select, MenuItem, Stack, SelectChangeEvent } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import useTreegeContext from "@/hooks/useTreegeContext";
import { getAllAncestorFromTree, getTree } from "@/utils/tree";

interface ReceiveValueFromParentProps {
  id: string;
  onChange?: (ancestorUuid?: string, ancestorName?: string) => void;
  value?: string | null;
}

const ReceiveValueFromAncestor = ({ onChange, id, value }: ReceiveValueFromParentProps) => {
  const { t } = useTranslation(["form"]);
  const { tree, treePath, currentHierarchyPointNode } = useTreegeContext();
  const { uuid } = currentHierarchyPointNode?.data || {};

  if (!tree || !uuid) {
    return null;
  }

  const currentTree = getTree(tree, treePath?.at(-1)?.path);
  const ancestors = getAllAncestorFromTree(currentTree, uuid);

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const newValue = event.target.value;
    const selectedAncestor = ancestors.find((a) => a.name === newValue);
    const selectedUuid = selectedAncestor?.uuid;

    onChange?.(selectedUuid, newValue);
  };

  return (
    <Stack spacing={1} pb={2} pt={3}>
      <Typography variant="body2" pb={1} sx={{ textDecoration: "underline" }}>
        {t("receiveValueFromParent")}
      </Typography>
      <Select
        id={id}
        variant="outlined"
        size="xSmall"
        value={value || ""}
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 300 },
          },
        }}
      >
        {ancestors.length && <MenuItem value="">&nbsp;</MenuItem>}

        {ancestors.length ? (
          ancestors.map(({ name }) => (
            <MenuItem key={`${name}-${uuid}`} value={name}>
              {name}
            </MenuItem>
          ))
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
