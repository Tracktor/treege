import { KeyboardArrowDown } from "@mui/icons-material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  DialogActions,
  Grid2,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  Select,
  MenuItem,
  Tooltip,
  Paper,
} from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";
import AssignValueToChildren from "@/features/Treege/components/Forms/AssignValueToChildren/AssignValueToChildren";
import ExtraField from "@/features/Treege/components/Forms/FormTreeCardMutation/ExtraField";
import useFormTreeCardMutation from "@/features/Treege/components/Forms/FormTreeCardMutation/useFormTreeCardMutation";
import ReceiveValueFromAncestor from "@/features/Treege/components/Forms/ReceiveValueFromAncestor";
import AutocompleteSelectType from "@/features/Treege/components/Inputs/AutocompleteSelectType";
import FieldSelectAutocompleteCreatable from "@/features/Treege/components/Inputs/FieldSelectAutocompleteCreatable";

interface FormTreeCardMutationProps {
  onClose(): void;
  title?: string;
  setIsLarge?(largeModal: boolean): void;
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

const FormTreeCardMutation = ({ onClose, title, setIsLarge }: FormTreeCardMutationProps) => {
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
    isLargeView,
    handleValueFromAncestor,
    defaultValueFromAncestor,
    handleAncestorRef,
    selectAncestorName,
    collapseOptions,
    setCollapseOptions,
  } = useFormTreeCardMutation({ setIsLarge });

  const { searchKey, url, pathKey, params } = route || {};
  const { object: routeObject = "", label: routeLabel = "", value: routeValue = "", image: routeImage = "" } = pathKey || {};

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid2 container height={600}>
        <Grid2 size={isLargeView ? 6 : 12} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
                  id="patternMessage"
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
                  id="patternMessage"
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
                  <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} position="relative">
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
                      <IconButton color="warning" sx={styles.iconButtonDelete} value={decisionId} onClick={handleDeleteValue}>
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

            {hasAncestors && <ReceiveValueFromAncestor id="receive-value" onChange={handleAncestorRef} value={selectAncestorName} />}
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
              onClick={handleSubmit}
            >
              {t("validate")}
            </Button>
          </DialogActions>
        </Grid2>

        {isLargeView && (
          <Grid2 size={6} maxHeight={600} sx={{ display: "flex" }}>
            <DialogContent>
              {(isDynamicSelect || isAutocomplete) && (
                <Grid2 container spacing={1} paddingY={1}>
                  <Grid2 size={12}>
                    <Typography variant="h5" pb={1}>
                      {t("form:urlConstruction")}
                    </Typography>
                  </Grid2>

                  <Grid2 size={isAutocomplete ? 7 : 12}>
                    <TextField
                      id="urlSelect"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkRoundedIcon />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="https://api.com/"
                      type="url"
                      label={t("form:apiRoute")}
                      onChange={handleChangeUrlSelect}
                      value={url}
                    />
                  </Grid2>

                  {isAutocomplete && (
                    <Grid2 size={5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <QuestionMarkRoundedIcon />
                        <TextField
                          id="searchKey"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          sx={{ flex: 1, minWidth: 0 }}
                          placeholder={t("form:searchKeyPlaceholder")}
                          type="text"
                          label={t("form:key")}
                          onChange={handleChangeSearchKey}
                          value={searchKey}
                        />
                      </Stack>
                    </Grid2>
                  )}
                </Grid2>
              )}

              {(isAutocomplete || isDynamicSelect) && (
                <>
                  <Stack
                    spacing={1}
                    paddingY={1}
                    direction={{ sm: "row", xs: "column" }}
                    position="relative"
                    alignItems={{ sm: "center", xs: "flex-start" }}
                  >
                    <Typography variant="h5">{t("form:additionalParams")}</Typography>
                    <Box justifyContent="flex-end">
                      <IconButton color="success" sx={styles.iconButton} onClick={handleAddParams}>
                        <AddCircleRoundedIcon />
                      </IconButton>
                    </Box>
                  </Stack>

                  {params?.map(({ id, key, staticValue, ancestorUuid, useAncestorValue }, index) => (
                    <Paper key={id} elevation={1} sx={{ marginY: 1 }}>
                      <Grid2 key={id} container pb={2} justifyContent="space-between" alignItems="center" padding={1} spacing={1}>
                        <Grid2 size={6}>
                          <Tooltip title={useAncestorValue && !key.length ? t("form:keyPathApiDescription") : ""}>
                            <TextField
                              id={`param-key-${id}`}
                              label="Key"
                              size="small"
                              onChange={({ target }) => handleChangeParam(index, "key", target.value)}
                              value={key}
                              inputProps={{ "data-id": id }}
                            />
                          </Tooltip>
                        </Grid2>

                        <Grid2 size={6}>
                          {useAncestorValue ? (
                            <Select
                              fullWidth
                              id={id}
                              variant="outlined"
                              size="small"
                              value={ancestorUuid || ""}
                              onChange={({ target }) => handleChangeParam(index, "ancestorUuid", target.value)}
                              MenuProps={{
                                PaperProps: {
                                  sx: { maxHeight: 300 },
                                },
                              }}
                            >
                              {ancestors.length ? (
                                ancestors.map(({ name: ancestorName, uuid: ancestorId }) => (
                                  <MenuItem key={ancestorId} value={ancestorId}>
                                    {ancestorName}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled value="">
                                  {t("form:noAncestorFound")}
                                </MenuItem>
                              )}
                            </Select>
                          ) : (
                            <TextField
                              id={`param-value-${id}`}
                              label={t("value", { ns: "form" })}
                              size="small"
                              fullWidth
                              onChange={({ target }) => handleChangeParam(index, "staticValue", target.value)}
                              value={staticValue || ""}
                              inputProps={{ "data-id": id }}
                            />
                          )}
                        </Grid2>

                        {!!ancestors.length && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                id={`useAncestorAsParam-${id}`}
                                disabled={!ancestors.length}
                                checked={useAncestorValue || false}
                                onChange={({ target }) => handleChangeParam(index, "useAncestorValue", target.checked)}
                              />
                            }
                            label={
                              <Typography variant="body2" color="textSecondary">
                                {t("form:useAncestorValueAsParam")}
                              </Typography>
                            }
                          />
                        )}
                        <IconButton color="error" value={id} onClick={handleDeleteParam}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Grid2>
                    </Paper>
                  ))}

                  <FormControlLabel
                    control={
                      <IconButton
                        onClick={() => setCollapseOptions((prev) => !prev)}
                        sx={{
                          transform: collapseOptions ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s",
                        }}
                      >
                        <KeyboardArrowDown />
                      </IconButton>
                    }
                    label={t("form:dataMapping")}
                  />

                  <Collapse in={collapseOptions}>
                    <Stack spacing={1} paddingY={1}>
                      <Stack spacing={1} sx={{ pb: 1 }} direction={{ sm: "row", xs: "column" }} alignItems="center">
                        <TextField
                          id="objectArrayPath"
                          size="small"
                          sx={{ flex: 3 }}
                          InputLabelProps={{ shrink: true }}
                          label="Object Array Path"
                          value={routeObject}
                          onChange={(event) => handleChangePath("object", event)}
                          placeholder="elements.features[]"
                          type="text"
                        />
                        <TextField
                          id="labelPath"
                          size="small"
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
                          id="valuePath"
                          size="small"
                          sx={{ flex: 3 }}
                          InputLabelProps={{ shrink: true }}
                          label="Value Path"
                          value={routeValue}
                          onChange={(event) => handleChangePath("value", event)}
                          placeholder="client.id"
                          type="text"
                        />
                        <TextField
                          id="imagePath"
                          size="small"
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
                  </Collapse>
                </>
              )}

              {selectAncestorName && (
                <AssignValueToChildren
                  ancestorName={selectAncestorName}
                  onChange={handleValueFromAncestor}
                  value={defaultValueFromAncestor}
                  currentTypeField={type}
                  displayTopDivier={isAutocomplete || isDynamicSelect}
                />
              )}
            </DialogContent>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
};

export default FormTreeCardMutation;
