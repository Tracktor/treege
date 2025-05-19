import {
  FormControl,
  Select,
  Stack,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  Switch,
  SelectChangeEvent,
} from "@tracktor/design-system";
import type { DefaultValueFromAncestor } from "@tracktor/types-treege";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { label: "String", value: "string" },
  { label: "Numeric", value: "numeric" },
  { label: "Boolean", value: "boolean" },
  { label: "API", value: "api" },
  { label: "Address", value: "address" },
];

interface AssignValueToChildrenProps {
  uuid: string;
  value?: DefaultValueFromAncestor | null;
  onChange?: ({ inputObjectKey, outputModel }: DefaultValueFromAncestor) => void;
}

const AssignValueToChildren = ({ uuid, onChange, value }: AssignValueToChildrenProps) => {
  const { t } = useTranslation(["form"]);
  const { outputModel, inputObjectKey } = value || {};

  const handleOutputModelChange = (event: SelectChangeEvent<string | null>) => {
    const newValue = event.target.value;
    console.log("uuid", uuid);
    onChange?.({ inputObjectKey: inputObjectKey ? String(inputObjectKey) : undefined, outputModel: String(newValue), uuid });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    uuid &&
      onChange?.({
        inputObjectKey: checked ? String(checked) : undefined,
        outputModel: outputModel ?? undefined,
        uuid,
      });
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    uuid &&
      onChange?.({
        inputObjectKey: newText,
        outputModel: outputModel ?? undefined,
        uuid,
      });
  };

  return (
    <Stack spacing={1} pb={2}>
      <Typography variant="body2" pb={1} sx={{ textDecoration: "underline" }}>
        {t("assignValueToChildren")}
      </Typography>
      <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
        <FormControl
          sx={{
            width: "35%",
          }}
        >
          <InputLabel>Data model</InputLabel>
          <Select label="Data model" value={outputModel ?? ""} onChange={handleOutputModelChange}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {["numeric", "string"].includes(outputModel!) && (
          <TextField
            value={inputObjectKey ?? ""}
            onChange={handleTextChange}
            sx={{
              width: "65%",
            }}
            label={t("staticValue")}
          />
        )}
        {["boolean"].includes(outputModel!) && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <InputLabel>{t("staticValue")}</InputLabel>
            <Switch value={inputObjectKey ?? false} onChange={handleInputChange} />
          </Stack>
        )}
        {["api"].includes(outputModel!) && (
          <TextField
            sx={{
              width: "65%",
            }}
            value={inputObjectKey ?? ""}
            label={t("keyPath")}
            onChange={handleTextChange}
          />
        )}{" "}
        {["address"].includes(outputModel!) && (
          <TextField
            sx={{
              width: "65%",
            }}
            value={inputObjectKey ?? ""}
            onChange={handleTextChange}
            label={t("keyPathObject")}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default AssignValueToChildren;
