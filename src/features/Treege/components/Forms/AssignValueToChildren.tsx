import { FormControl, Select, Stack, TextField, Typography, InputLabel, MenuItem, Switch } from "@tracktor/design-system";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { label: "String", value: "string" },
  { label: "Numeric", value: "numeric" },
  { label: "Boolean", value: "boolean" },
  { label: "API", value: "api" },
  { label: "Address", value: "address" },
];

const AssignValueToChildren = () => {
  const { t } = useTranslation(["form"]);
  const [modelValue, setModelValue] = useState<string | null>(null);

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
          <Select
            label="Data model"
            value={modelValue}
            onChange={(event) => {
              const newValue = event.target.value;
              setModelValue(newValue);
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {["numeric", "string"].includes(modelValue!) && (
          <TextField
            sx={{
              width: "65%",
            }}
            label={t("staticValue")}
          />
        )}
        {["boolean"].includes(modelValue!) && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <InputLabel>{t("staticValue")}</InputLabel>
            <Switch />
          </Stack>
        )}
        {["api"].includes(modelValue!) && (
          <TextField
            sx={{
              width: "65%",
            }}
            label={t("keyPath")}
          />
        )}{" "}
        {["address"].includes(modelValue!) && (
          <TextField
            sx={{
              width: "65%",
            }}
            label={t("keyPathObject")}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default AssignValueToChildren;
