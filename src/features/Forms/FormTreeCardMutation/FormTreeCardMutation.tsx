import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./FormTreeCardMutation.module.scss";
import useFormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/useFormTreeCardMutation";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardMutation = ({ onClose }: FormTreeCardMutationProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    values,
    required,
    disabled,
    handleChangeRequired,
    handleChangeDisabled,
    handleChangeName,
    name,
    type,
    handleChangeType,
    handleChangeLabel,
    handleDeleteValue,
    handleChangeValue,
    handleSubmit,
    handleAddValue,
    isMultipleFieldValuesSelected,
    getDisabledValueField,
  } = useFormTreeCardMutation();

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1} paddingY={1}>
        <TextField
          label={t("name")}
          variant="outlined"
          sx={{ flex: 1 }}
          onChange={handleChangeName}
          value={name}
          helperText={t("mustBeUnique", { ns: "form" })}
          required
        />

        <FormControl sx={{ flex: 1 }} required>
          <InputLabel>{t("type")}</InputLabel>
          <Select value={type} label={t("type")} onChange={handleChangeType}>
            <MenuItem value="checkbox">{t("type.checkbox", { ns: "form" })}</MenuItem>
            <MenuItem value="number">{t("type.number", { ns: "form" })}</MenuItem>
            <MenuItem value="radio">{t("type.radio", { ns: "form" })}</MenuItem>
            <MenuItem value="select">{t("type.select", { ns: "form" })}</MenuItem>
            <MenuItem value="text">{t("type.text", { ns: "form" })}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <FormGroup>
        <FormControlLabel control={<Checkbox checked={required} onChange={handleChangeRequired} />} label={t("required")} />
      </FormGroup>

      <FormGroup>
        <FormControlLabel control={<Checkbox checked={disabled} onChange={handleChangeDisabled} />} label={t("disabled")} />
      </FormGroup>

      <h4>{t("values")}</h4>

      {values?.map(({ value, label, id }, index) => (
        <Stack direction="row" spacing={1} paddingY={1} key={id} position="relative">
          <TextField
            label="Label"
            variant="outlined"
            sx={{ flex: 1 }}
            onChange={handleChangeLabel}
            value={label}
            inputProps={{ "data-id": id }}
            required
            disabled={getDisabledValueField(index)}
          />
          <TextField
            label="Valeur"
            variant="outlined"
            sx={{ flex: 1 }}
            onChange={handleChangeValue}
            value={value}
            inputProps={{ "data-id": id }}
            required
            disabled={getDisabledValueField(index)}
          />
          {values.length > 1 && (
            <Button color="warning" className={styles.IconButtonDelete} data-id={id} onClick={() => handleDeleteValue(id)}>
              <RemoveCircleRoundedIcon />
            </Button>
          )}
        </Stack>
      ))}

      {isMultipleFieldValuesSelected && (
        <Box justifyContent="flex-end" display="flex">
          <Button color="success" className={styles.IconButton} onClick={handleAddValue}>
            <AddCircleRoundedIcon />
          </Button>
        </Box>
      )}

      <Stack spacing={2} direction="row" justifyContent="flex-end" paddingTop={3}>
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" type="submit">
          {t("validate")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardMutation;
