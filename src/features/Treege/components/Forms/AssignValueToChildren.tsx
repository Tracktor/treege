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
  Box,
  Grid2,
  Card,
  CardContent,
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

const ApiOutPutExample = () => (
  <Stack spacing={2}>
    <Grid2 size={12}>
      <Typography variant="h5">Example</Typography>
    </Grid2>

    <Grid2 size={12}>
      <Card>
        <CardContent sx={{ py: 2 }}>
          <Stack spacing={2}>
            <Box component="pre">
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <Stack>
                  <Typography variant="h5" pb={1}>
                    Model
                  </Typography>
                  <Typography variant="body2" component="code" sx={{ whiteSpace: "pre-wrap" }}>
                    {`{
     "city": "Paris"
      "country": "France"
      "street": "Rue de Rivoli"
      "street_number": "1"
}`}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h5" pb={1}>
                    Mapping
                  </Typography>
                  <Typography variant="body2" component="code" sx={{ whiteSpace: "pre-wrap" }}>
                    {`{
  "user": {
    "address": {
      "city": "Paris"
    }
  }
}`}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid2>

    <Grid2 size={12}>
      <Typography variant="body2">➡️ Clé à saisir : user.address</Typography>
    </Grid2>
  </Stack>
);

const ParentToBooleanExample = () => (
  <Stack spacing={2}>
    <Typography variant="h6">If boolean ancestor it render boolean ancestor</Typography>
    <Typography variant="h6">If not boolean ancestor it render:</Typography>
    <Card>
      <CardContent sx={{ py: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ p: 1 }}>
            <Typography variant="body2">
              🟢 <strong>ancestor has value</strong> → <strong>true</strong>
            </Typography>
          </Box>
          <Box sx={{ p: 1 }}>
            <Typography variant="body2">
              ⚪ <strong>ancestor has no value</strong> → <strong>false</strong>
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Stack>
);

interface AssignValueToChildrenProps {
  value?: DefaultValueFromAncestor | null;
  onChange?: (inputObjectKey: string, outputModel: string) => void;
  ancestorName: string;
}

const AssignValueToChildren = ({ onChange, value, ancestorName }: AssignValueToChildrenProps) => {
  const { t } = useTranslation(["form"]);
  const { outputModel, inputObjectKey } = value || {};

  const handleOutputModelChange = (event: SelectChangeEvent<string | null>) => {
    const newValue = event.target.value;
    onChange?.(inputObjectKey || "", String(newValue));
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    onChange?.(newText, outputModel || "");
  };

  return (
    <Grid2 container>
      <Typography variant="body2" pb={2} sx={{ textDecoration: "underline" }}>
        {t("ancestorValue", { ancestorName })}
      </Typography>

      <Grid2 size={12}>
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
          {["api", "address"].includes(outputModel!) && (
            <TextField
              sx={{
                width: "65%",
              }}
              value={inputObjectKey ?? ""}
              label={t("keyPathObject")}
              onChange={handleTextChange}
            />
          )}
        </Stack>
        <Grid2 size={12} pt={3}>
          {["api", "address"].includes(outputModel!) && <ApiOutPutExample />}
          {["boolean"].includes(outputModel!) && <ParentToBooleanExample />}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default AssignValueToChildren;
