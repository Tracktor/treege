import { InputLabel, Select, MenuItem, Stack, SelectChangeEvent } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import useTreegeContext from "@/hooks/useTreegeContext";

interface ReceiveValueFromParentProps {
  id: string;
  ancestors: { uuid: string; name?: string }[];
  onChange?: (ancestorUuid?: string, ancestorName?: string) => void;
  value?: string | null;
}

const ReceiveValueFromAncestor = ({ onChange, id, value, ancestors }: ReceiveValueFromParentProps) => {
  const { t } = useTranslation(["form"]);
  const { tree, currentHierarchyPointNode } = useTreegeContext();
  const { uuid } = currentHierarchyPointNode?.data || {};
  const labelId = `label-${id}`;

  if (!tree || !uuid) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const { value: newValue } = event.target;
    const selectedAncestor = ancestors.find((a) => a.name === newValue);
    const selectedUuid = selectedAncestor?.uuid;

    onChange?.(selectedUuid, newValue);
  };

  return (
    <Stack spacing={1} pb={2} pt={3}>
      <InputLabel id={labelId}> {t("receiveValueFromParent")}</InputLabel>
      <Select
        id={id}
        labelId={labelId}
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
