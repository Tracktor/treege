import WebhookIcon from "@mui/icons-material/Webhook";
import { Autocomplete, Chip, MenuItem, SxProps, TextField } from "@tracktor/design-system";
import type { TreeNodeField } from "@tracktor/types-treege";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import useAutocompleteSelectType from "@/features/TreegeTree/components/Inputs/AutocompleteSelectType/useAutocompleteSelectType";

export interface FieldsSelectProps {
  id: string;
  value: TreeNodeField["type"];
  onChange?: (event: SyntheticEvent, value: (typeof fields)[number]) => void;
  sx?: SxProps;
}

const AutocompleteSelectType = ({ id, onChange, value, sx }: FieldsSelectProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { currentValue, options } = useAutocompleteSelectType(value);

  return (
    <Autocomplete
      disableClearable
      fullWidth
      size="small"
      id={id}
      sx={sx}
      options={options}
      value={currentValue}
      onChange={onChange}
      getOptionLabel={(option) => t(`form:type.${option.type}`)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderInput={(params) => <TextField {...params} required size="small" label={t("type")} />}
      renderOption={(props, option) => {
        // eslint-disable-next-line react/prop-types
        const { key, ...rest } = props;

        // This field is selected in option of Api fields
        if (option.type === "autocomplete") return null;

        if (option.type === "dynamicSelect")
          return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <MenuItem key={key} {...rest}>
              {t(`form:type.${option.type}`)}
              <WebhookIcon
                fontSize="small"
                sx={{
                  color: "green",
                  ml: 1,
                }}
              />
            </MenuItem>
          );

        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <MenuItem key={key} {...rest}>
            {t(`form:type.${option.type}`)}
            {option.isDecisionField && <Chip label={t("decisionField", { ns: "form" })} size="small" color="info" sx={{ marginLeft: 1 }} />}
          </MenuItem>
        );
      }}
    />
  );
};

export default AutocompleteSelectType;
