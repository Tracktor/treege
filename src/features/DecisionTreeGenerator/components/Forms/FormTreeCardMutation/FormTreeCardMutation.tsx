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
} from "design-system-tracktor";
import { useTranslation } from "react-i18next";
import styles from "./FormTreeCardMutation.module.scss";
import fields from "@/constants/fields";
import TreeData from "@/constants/TreeData";
import useFormTreeCardMutation from "@/features/DecisionTreeGenerator/components/Forms/FormTreeCardMutation/useFormTreeCardMutation";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardMutation = ({ onClose }: FormTreeCardMutationProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    values,
    required,
    name,
    uniqueNameErrorMessage,
    type,
    helperText,
    label,
    messages: { on, off },
    isBooleanField,
    isDecision,
    isDecisionField,
    isRequiredDisabled,
    isTree,
    treeSelect,
    handleChangeTreeSelect,
    handleChangeHelperText,
    handleChangeOptionMessage,
    handleChangeRequired,
    handleChangeName,
    handleChangeType,
    handleChangeIsDecisionField,
    handleChangeOptionLabel,
    handleDeleteValue,
    handleChangeOptionValue,
    handleChangeMessage,
    handleSubmit,
    handleAddValue,
    handleChangeLabel,
  } = useFormTreeCardMutation();

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
        <TextField sx={{ flex: 1 }} label={t("label", { ns: "form" })} onChange={handleChangeLabel} value={label} required />
        <TextField
          label={t("name")}
          sx={{ flex: 1 }}
          onChange={handleChangeName}
          value={name}
          error={!!uniqueNameErrorMessage}
          helperText={uniqueNameErrorMessage}
          required
        />
      </Stack>

      <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
        <FormControl sx={{ flex: 1 }} required>
          <InputLabel>{t("type")}</InputLabel>
          <Select value={type} label={t("type")} onChange={handleChangeType}>
            {fields.map(({ type: fieldsType }) => (
              <MenuItem key={fieldsType} value={fieldsType}>
                {t(`type.${fieldsType}`, { ns: "form" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isTree ? (
          <FormControl sx={{ flex: 1 }} required>
            <InputLabel>{t("tree", { ns: "form" })}</InputLabel>
            <Select value={treeSelect} label={t("type")} onChange={handleChangeTreeSelect}>
              {TreeData.map(({ label: treeLabel, id: treeId }) => (
                <MenuItem key={treeId} value={treeId}>
                  {treeLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField sx={{ flex: 1 }} label={t("helperText", { ns: "form" })} onChange={handleChangeHelperText} value={helperText} />
        )}
      </Stack>

      {isBooleanField && (
        <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
          <TextField sx={{ flex: 1 }} label={t("onMessage", { ns: "form" })} onChange={handleChangeMessage("on")} value={on} />
          <TextField sx={{ flex: 1 }} label={t("offMessage", { ns: "form" })} onChange={handleChangeMessage("off")} value={off} />
        </Stack>
      )}

      <Stack paddingY={1}>
        <FormGroup>
          <FormControlLabel
            disabled={isRequiredDisabled}
            control={<Checkbox checked={required} onChange={handleChangeRequired} />}
            label={t("required")}
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            disabled={!isDecisionField}
            control={<Checkbox checked={isDecision} onChange={handleChangeIsDecisionField} />}
            label={t("decisionField", { ns: "form" })}
          />
        </FormGroup>
      </Stack>

      {isDecisionField && (
        <>
          <h4>{t("values")}</h4>
          {values?.map(({ value, label: labelOption, id, message }) => (
            <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} key={id} position="relative">
              <TextField
                label={t("label", { ns: "form" })}
                sx={{ flex: 1 }}
                onChange={handleChangeOptionLabel}
                value={labelOption}
                inputProps={{ "data-id": id }}
                required
              />
              <TextField
                label={t("value", { ns: "form" })}
                sx={{ flex: 1 }}
                onChange={handleChangeOptionValue}
                value={value}
                inputProps={{ "data-id": id }}
                required
              />
              <TextField
                label="Message"
                sx={{ flex: 1 }}
                onChange={handleChangeOptionMessage}
                value={message}
                inputProps={{ "data-id": id }}
              />
              {values.length > 1 && (
                <Button color="warning" className={styles.IconButtonDelete} data-id={id} onClick={() => handleDeleteValue(id)}>
                  <RemoveCircleRoundedIcon />
                </Button>
              )}
            </Stack>
          ))}
        </>
      )}

      {isDecisionField && (
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
        <Button variant="contained" type="submit" disabled={!!uniqueNameErrorMessage}>
          {t("validate")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardMutation;
