import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";
import ApiFieldsConfigAccordion from "@/features/Treege/components/Forms/FormTreeCardMutation/Fields/ApiFieldsConfigAccordion";
import ExtraField from "@/features/Treege/components/Forms/FormTreeCardMutation/Fields/ExtraField";
import FillerFieldAccordion from "@/features/Treege/components/Forms/FormTreeCardMutation/Fields/FillerFieldAccordion";
import useFormTreeCardMutation from "@/features/Treege/components/Forms/FormTreeCardMutation/useFormTreeCardMutation";
import AutocompleteSelectType from "@/features/Treege/components/Inputs/AutocompleteSelectType";
import FieldSelectAutocompleteCreatable from "@/features/Treege/components/Inputs/FieldSelectAutocompleteCreatable";

interface FormTreeCardMutationProps {
  onClose(): void;
  title?: string;
}

const FormTreeCardMutation = ({ onClose, title }: FormTreeCardMutationProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    ancestors,
    hasAncestors,
    patternOptions,
    values,
    required,
    tag,
    type,
    helperText,
    label,
    name,
    hiddenValue,
    isBooleanField,
    isDisabledPast,
    handleChangeIsDisabledPast,
    isDecision,
    isDecisionField,
    isHiddenField,
    isRequiredDisabled,
    isRepeatableDisabled,
    isAutocomplete,
    isDateRangePicker,
    isDynamicSelect,
    isTreeField,
    treeSelected,
    isWorkflowLoading,
    repeatable,
    isMultiplePossible,
    isPatternEnabled,
    isMultiple,
    initialQuery,
    handleChangeTreeSelect,
    handleChangeHelperText,
    handleChangeRequired,
    handleChangeName,
    handleChangeType,
    handleChangeIsDecisionField,
    handleDeleteValue,
    handleDeleteParam,
    handleChangeMessage,
    handleSubmit,
    handleAddValue,
    handleAddParams,
    handleChangeLabel,
    handleChangeRepeatable,
    handleChangeHiddenValue,
    handleChangeTag,
    handleChangeSearchKey,
    handleChangeUrlSelect,
    handleChangeParam,
    handleChangePath,
    handleChangeMultiple,
    handleChangeInitialQuery,
    route,
    handlePresetValues,
    patternMessage,
    pattern,
    handleChangePattern,
    handleChangePatternMessage,
    messages: { on, off },
    handleValueFromAncestor,
    defaultValueFromAncestor,
    handleAncestorRef,
    selectAncestorName,
    collapseOptions,
    setCollapseOptions,
    hasApiConfig,
    validDynamicUrlParams,
  } = useFormTreeCardMutation();

  const { searchKey, url, pathKey, params } = route || {};
  const { object: routeObject = "", label: routeLabel = "", value: routeValue = "", image: routeImage = "" } = pathKey || {};

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container height={600}>
        <Grid size={12} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <DialogContent>
            <Typography variant="h3" pb={2}>
              {title}
            </Typography>
            <AutocompleteSelectType id="type" value={type} onChange={handleChangeType} sx={{ marginBottom: 1 }} />
            {/* Name and label */}
            <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
              <TextField
                autoComplete="off"
                id="name"
                label={t("name")}
                sx={{ flex: 1 }}
                onChange={handleChangeName}
                value={name}
                size="small"
                required
              />
              <TextField
                id="label"
                sx={{ flex: 1 }}
                label={t("label", { ns: "form" })}
                onChange={handleChangeLabel}
                value={label}
                size="small"
              />
            </Stack>
            {/* Tag & helper text */}
            <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
              {type !== "title" && <FieldSelectAutocompleteCreatable id="tag" value={tag} onChange={handleChangeTag} />}
              <ExtraField
                id="helperText"
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
            {/* Pattern */}
            {isPatternEnabled && (
              <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
                <Autocomplete
                  freeSolo
                  id="autoCompletePatternMessage"
                  size="small"
                  sx={{ flex: 1 }}
                  onChange={handleChangePattern}
                  onInputChange={handleChangePattern}
                  value={pattern}
                  options={patternOptions}
                  renderInput={(props) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <TextField {...props} label={t("form:pattern")} />
                  )}
                />

                <TextField
                  id="patternMessageText"
                  label={t("form:patternMessage")}
                  sx={{ flex: 1 }}
                  onChange={handleChangePatternMessage}
                  value={patternMessage}
                  size="small"
                />
              </Stack>
            )}
            {/* Boolean field */}
            {isBooleanField && (
              <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
                <TextField
                  id="onMessage"
                  size="small"
                  sx={{ flex: 1 }}
                  label={t("onMessage", { ns: "form" })}
                  onChange={handleChangeMessage("on")}
                  value={on}
                />
                <TextField
                  id="offMessage"
                  size="small"
                  sx={{ flex: 1 }}
                  label={t("offMessage", { ns: "form" })}
                  onChange={handleChangeMessage("off")}
                  value={off}
                />
              </Stack>
            )}

            {hasApiConfig && (
              <ApiFieldsConfigAccordion
                isAutocomplete={isAutocomplete}
                isDynamicSelect={isDynamicSelect}
                url={url}
                searchKey={searchKey}
                sliceUrlParams={validDynamicUrlParams}
                apiParams={params}
                ancestors={ancestors}
                collapseOptions={collapseOptions}
                apiMapping={{
                  image: routeImage,
                  label: routeLabel,
                  object: routeObject,
                  value: routeValue,
                }}
                onChangeUrlSelect={handleChangeUrlSelect}
                onChangeSearchKey={handleChangeSearchKey}
                onAddParams={handleAddParams}
                onChangeParams={handleChangeParam}
                onDeleteParams={handleDeleteParam}
                onChangeApiMapping={handleChangePath}
                setCollapseOptions={setCollapseOptions}
              />
            )}

            <Stack paddingY={1}>
              <FormGroup row>
                {isMultiplePossible && (
                  <FormControlLabel control={<Checkbox checked={isMultiple} onChange={handleChangeMultiple} />} label={t("multiple")} />
                )}
                {isAutocomplete && (
                  <FormControlLabel
                    control={<Checkbox id="isInitialQuery" checked={initialQuery} onChange={handleChangeInitialQuery} />}
                    label={t("initialQueryEnable")}
                  />
                )}
                <FormControlLabel
                  disabled={isRequiredDisabled}
                  control={<Checkbox id="isRequired" checked={required} onChange={handleChangeRequired} />}
                  label={t("required")}
                />
                <FormControlLabel
                  disabled={isRepeatableDisabled}
                  control={<Checkbox id="isRepeatable" checked={repeatable} onChange={handleChangeRepeatable} />}
                  label={t("repeatable", { ns: "form" })}
                />
                {isDecisionField && (
                  <FormControlLabel
                    control={<Checkbox id="isDecision" checked={isDecision} onChange={handleChangeIsDecisionField} />}
                    label={t("decisionField", { ns: "form" })}
                  />
                )}
                {isDateRangePicker && (
                  <FormControlLabel
                    control={<Checkbox id="disabledPast" checked={isDisabledPast} onChange={handleChangeIsDisabledPast} />}
                    label={t("disabledPast", { ns: "form" })}
                  />
                )}
              </FormGroup>
            </Stack>

            {isDecisionField && (
              <>
                <Typography variant="h4">{t("values")}</Typography>
                {values?.map(({ value: decisionValue, label: decisionLabel, id: decisionId, message: decisionMessage }) => (
                  <Stack key={decisionId} direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} position="relative">
                    <TextField
                      id={`decision-label-${decisionId}`}
                      label={t("label", { ns: "form" })}
                      size="small"
                      sx={{ flex: 1 }}
                      onChange={handlePresetValues("label")}
                      value={decisionLabel}
                      inputProps={{ "data-id": decisionId }}
                      required
                    />
                    <TextField
                      id={`decision-value-${decisionId}`}
                      label={t("value", { ns: "form" })}
                      size="small"
                      sx={{ flex: 1 }}
                      onChange={handlePresetValues("value")}
                      value={decisionValue}
                      inputProps={{ "data-id": decisionId }}
                      required
                    />
                    <TextField
                      id={`decision-message-${decisionId}`}
                      label={t("message", { ns: "form" })}
                      size="small"
                      sx={{ flex: 1 }}
                      onChange={handlePresetValues("message")}
                      value={decisionMessage}
                      inputProps={{ "data-id": decisionId }}
                    />
                    {values.length > 1 && (
                      <IconButton
                        color="warning"
                        sx={{
                          "&:before": {
                            borderRadius: `50%`,
                            content: '""',
                            height: 20,
                            position: `absolute`,
                            width: 20,
                            zIndex: -1,
                          },
                          backgroundColor: colors.background,
                          marginRight: "-20px !important",
                          minWidth: "auto !important",
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        value={decisionId}
                        onClick={handleDeleteValue}
                      >
                        <RemoveCircleRoundedIcon />
                      </IconButton>
                    )}
                  </Stack>
                ))}
              </>
            )}

            {isDecisionField && (
              <Box justifyContent="flex-end" display="flex">
                <IconButton
                  color="success"
                  sx={{
                    marginRight: "-20px !important",
                    minWidth: "auto !important",
                  }}
                  onClick={handleAddValue}
                >
                  <AddCircleRoundedIcon />
                </IconButton>
              </Box>
            )}

            {hasAncestors && (
              <FillerFieldAccordion
                selectAncestorName={selectAncestorName}
                type={type}
                isDynamicSelect={isDynamicSelect}
                isAutocomplete={isAutocomplete}
                ancestors={ancestors}
                defaultValueFromAncestor={defaultValueFromAncestor}
                onChangeValueFromAncestor={handleValueFromAncestor}
                onChangeAncestorRef={handleAncestorRef}
              />
            )}
          </DialogContent>

          <DialogActions>
            <Button variant="text" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isWorkflowLoading}
              isLoading={isWorkflowLoading}
              loadingIndicator={<CircularProgress size={14} />}
            >
              {t("validate")}
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormTreeCardMutation;
