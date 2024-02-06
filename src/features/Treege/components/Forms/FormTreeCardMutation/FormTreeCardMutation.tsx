import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";
import EndPointWarning from "@/features/Treege/components/EndPointWarning";
import FieldSelect from "@/features/Treege/components/FieldSelect";
import FieldSelectAutocompleteCreatable from "@/features/Treege/components/FieldSelectAutocompleteCreatable";
import ExtraField from "@/features/Treege/components/Forms/FormTreeCardMutation/ExtraField";
import useFormTreeCardMutation from "@/features/Treege/components/Forms/FormTreeCardMutation/useFormTreeCardMutation";

interface FormTreeCardMutationProps {
  onClose(): void;
}

const iconButtonCommonStyle = {
  marginRight: "-20px !important",
  minWidth: "auto !important",
};

const styles = {
  iconButton: iconButtonCommonStyle,
  iconButtonDelete: {
    ...iconButtonCommonStyle,
    "&:before": {
      borderRadius: `50%`,
      content: '""',
      height: 20,
      position: `absolute`,
      width: 20,
      zIndex: -1,
    },
    backgroundColor: colors.background,
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
};

const FormTreeCardMutation = ({ onClose }: FormTreeCardMutationProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    values,
    required,
    name,
    tag,
    uniqueNameErrorMessage,
    type,
    helperText,
    label,
    hiddenValue,
    isBooleanField,
    isDecision,
    isEditModal,
    isDecisionField,
    isHiddenField,
    isRequiredDisabled,
    isRepeatableDisabled,
    isAutocomplete,
    isTreeField,
    treeSelected,
    isWorkflowLoading,
    repeatable,
    isLeaf,
    messages: { on, off },
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
    handleAddParams,
    handleChangeLabel,
    handleChangeRepeatable,
    handleChangeHiddenValue,
    handleChangeTag,
    handleChangeSearchKey,
    handleChangeUrl,
    handleChangeParam,
    handleChangePath,
    url,
    params,
    routeLabel,
    routeValue,
    routeImage,
    routeObject,
    searchKey,
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
        <FieldSelect value={type} onChange={handleChangeType} />
        <ExtraField
          helperText={helperText}
          hiddenValue={hiddenValue}
          isHiddenField={isHiddenField}
          isTreeField={isTreeField}
          treeSelected={treeSelected}
          handleChangeTreeSelect={handleChangeTreeSelect}
          handleChangeHelperText={handleChangeHelperText}
          handleChangeHiddenValue={handleChangeHiddenValue}
        />
      </Stack>

      {isAutocomplete && (
        <Stack spacing={1} paddingY={1}>
          <Stack spacing={1} direction={{ sm: "row", xs: "column" }} alignItems="center">
            <TextField
              sx={{ flex: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkRoundedIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="https://api.fr/enpoint"
              type="url"
              label={t("form:apiRoute")}
              onChange={handleChangeUrl}
              value={url}
              required
            />
            <QuestionMarkRoundedIcon />
            <TextField sx={{ flex: 1 }} placeholder="q" type="text" onChange={handleChangeSearchKey} value={searchKey} required />
          </Stack>

          <EndPointWarning endPoint={{ searchKey, url }} />
          <Stack spacing={1} paddingY={1}>
            <Stack spacing={1} sx={{ pb: 1 }} direction={{ sm: "row", xs: "column" }} alignItems="center">
              <TextField
                sx={{ flex: 3 }}
                InputLabelProps={{ shrink: true }}
                label="Object Array Path"
                value={routeObject}
                onChange={(event) => handleChangePath("object", event)}
                placeholder="elements.features[]"
                type="text"
              />
              <TextField
                sx={{ flex: 3 }}
                InputLabelProps={{ shrink: true }}
                label="Label Path"
                value={routeLabel}
                onChange={(event) => handleChangePath("label", event)}
                placeholder="client.name"
                type="text"
              />
            </Stack>
            <Stack spacing={1} direction={{ sm: "row", xs: "column" }} alignItems="center">
              <TextField
                sx={{ flex: 3 }}
                InputLabelProps={{ shrink: true }}
                label="Value Path"
                value={routeValue}
                onChange={(event) => handleChangePath("value", event)}
                placeholder="client.id"
                type="text"
              />
              <TextField
                sx={{ flex: 3 }}
                InputLabelProps={{ shrink: true }}
                label="Image Path"
                value={routeImage}
                onChange={(event) => handleChangePath("image", event)}
                placeholder="client.src.profile"
                type="text"
              />
            </Stack>
          </Stack>
          <>
            <h4>Extra Params</h4>
            {params?.map(({ id, key, value }, index) => (
              <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} key={id} position="relative">
                <TextField
                  label="Key"
                  sx={{ flex: 1 }}
                  onChange={(event) => handleChangeParam(index, "key", event)}
                  value={key}
                  inputProps={{ "data-id": index }}
                />
                <TextField
                  label={t("value", { ns: "form" })}
                  sx={{ flex: 1 }}
                  onChange={(event) => handleChangeParam(index, "value", event)}
                  value={value}
                  inputProps={{ "data-id": index }}
                />
                {values.length > 1 && (
                  <IconButton color="warning" sx={styles.iconButtonDelete} value={index} onClick={handleDeleteValue}>
                    <RemoveCircleRoundedIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
          </>
          <Box justifyContent="flex-end" display="flex">
            <IconButton color="success" sx={styles.iconButton} onClick={handleAddParams}>
              <AddCircleRoundedIcon />
            </IconButton>
          </Box>
        </Stack>
      )}

      <Stack spacing={1} direction={{ sm: "row", xs: "column" }}>
        <FieldSelectAutocompleteCreatable value={tag} onChange={handleChangeTag} />
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
          <FormControlLabel
            disabled={isRepeatableDisabled}
            control={<Checkbox checked={repeatable} onChange={handleChangeRepeatable} />}
            label={t("repeatable", { ns: "form" })}
          />

          {(isLeaf || isEditModal) && (
            <FormControlLabel
              disabled={!isDecisionField}
              control={<Checkbox checked={isDecision} onChange={handleChangeIsDecisionField} />}
              label={t("decisionField", { ns: "form" })}
            />
          )}
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
                <IconButton color="warning" sx={styles.iconButtonDelete} value={id} onClick={handleDeleteValue}>
                  <RemoveCircleRoundedIcon />
                </IconButton>
              )}
            </Stack>
          ))}
        </>
      )}

      {isDecisionField && (
        <Box justifyContent="flex-end" display="flex">
          <IconButton color="success" sx={styles.iconButton} onClick={handleAddValue}>
            <AddCircleRoundedIcon />
          </IconButton>
        </Box>
      )}

      <Stack spacing={2} direction="row" justifyContent="flex-end" paddingTop={3}>
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={!!uniqueNameErrorMessage || isWorkflowLoading}
          isLoading={isWorkflowLoading}
          loadingIndicator={<CircularProgress size={14} />}
        >
          {t("validate")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardMutation;
