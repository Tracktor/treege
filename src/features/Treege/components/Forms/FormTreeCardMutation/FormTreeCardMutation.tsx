import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
} from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";
import DynamicSelectWarning from "@/features/Treege/components/Feedback/DynamicSelectWarning";
import AssignValueToChildren from "@/features/Treege/components/Forms/AssignValueToChildren/AssignValueToChildren";
import ExtraField from "@/features/Treege/components/Forms/FormTreeCardMutation/ExtraField";
import useFormTreeCardMutation from "@/features/Treege/components/Forms/FormTreeCardMutation/useFormTreeCardMutation";
import ReceiveValueFromAncestor from "@/features/Treege/components/Forms/ReceiveValueFromAncestor";
import AutocompleteSelectType from "@/features/Treege/components/Inputs/AutocompleteSelectType";
import DynamicSelectFieldFromTree from "@/features/Treege/components/Inputs/DynamicSelectFieldFromTree";
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
    isEditModal,
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
    isLeaf,
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
    handleChangeUrl,
    handleChangeUrlSelect,
    handleChangeParam,
    handleChangePath,
    handleChangeMultiple,
    handleChangeParentRef,
    handleChangeInitialQuery,
    parentRef,
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
    hasAncestors,
  } = useFormTreeCardMutation({ setIsLarge });

  const { searchKey, url, pathKey, params } = route || {};
  const { object: routeObject = "", label: routeLabel = "", value: routeValue = "", image: routeImage = "" } = pathKey || {};

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxHeight: "100%", overflow: "hidden" }}>
      <Grid2 container height="100%">
        <Grid2 size={isLargeView ? 6 : 12} sx={{ maxHeight: "100%", overflowY: "auto" }}>
          <DialogContent
            sx={{
              backgroundColor: colors.background,
              border: `solid 1px ${colors.borderBlue}`,
            }}
          >
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
              <FormGroup>
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
                {(isLeaf || isEditModal) && (
                  <FormControlLabel
                    disabled={!isDecisionField}
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
                <h4>{t("values")}</h4>
                {values?.map(({ value: decisionValue, label: decisionLabel, id: decisionId, message: decisionMessage }) => (
                  <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} key={decisionId} position="relative">
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

            <DialogActions
              sx={{
                backgroundColor: colors.background,
                borderTop: `1px solid ${colors.borderBlue}`,
                bottom: 0,
                padding: 3,
                position: "sticky",
                zIndex: 1,
              }}
            >
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
          </DialogContent>
        </Grid2>

        {isLargeView && (
          <Grid2
            size={6}
            maxHeight={600}
            sx={{
              overflowY: "auto",
              scrollbarGutter: "stable",
            }}
          >
            <DialogContent>
              {isAutocomplete && (
                <Stack spacing={1} paddingY={1}>
                  <h4>{t("form:urlConstruction")}</h4>
                  <Stack spacing={1} direction={{ sm: "row", xs: "column" }} alignItems="center">
                    <TextField
                      id="url"
                      size="small"
                      sx={{ flex: 3 }}
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
                    <TextField
                      id="searchKey"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                      placeholder={t("form:searchKeyPlaceholder")}
                      type="text"
                      label={t("form:key")}
                      onChange={handleChangeSearchKey}
                      value={searchKey}
                    />
                  </Stack>
                </Stack>
              )}

              {isDynamicSelect && (
                <Stack spacing={1} paddingY={1}>
                  <h4>{t("form:urlConstruction")}</h4>
                  <Stack spacing={1} direction={{ sm: "row", xs: "column" }} alignItems="center">
                    <DynamicSelectFieldFromTree id="parentRef" value={parentRef} onChange={handleChangeParentRef} />
                    <ArrowForwardIcon />
                    <TextField
                      id="urlSelect"
                      size="small"
                      sx={{ flex: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkRoundedIcon />
                          </InputAdornment>
                        ),
                      }}
                      placeholder={`https://api.fr/{{${parentRef || ""}}}/enpoint`}
                      type="url"
                      label={t("form:apiRoute")}
                      onChange={handleChangeUrlSelect}
                      value={url}
                    />
                  </Stack>
                  {url && <DynamicSelectWarning value={parentRef} />}
                </Stack>
              )}

              {(isAutocomplete || isDynamicSelect) && (
                <Stack spacing={1} paddingY={1}>
                  <Stack>
                    <Stack
                      spacing={1}
                      paddingY={1}
                      direction={{ sm: "row", xs: "column" }}
                      position="relative"
                      alignItems={{ sm: "center", xs: "flex-start" }}
                    >
                      <h4>{t("form:additionalParams")}</h4>
                      <Box justifyContent="flex-end">
                        <IconButton color="success" sx={styles.iconButton} onClick={handleAddParams}>
                          <AddCircleRoundedIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                    {params?.map(({ id, key, value }, index) => (
                      <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} key={id} position="relative">
                        <TextField
                          id={`param-key-${id}`}
                          label="Key"
                          size="small"
                          sx={{ flex: 1 }}
                          onChange={(event) => handleChangeParam(index, "key", event)}
                          value={key}
                          inputProps={{ "data-id": id }}
                        />
                        <TextField
                          id={`param-value-${id}`}
                          label={t("value", { ns: "form" })}
                          size="small"
                          sx={{ flex: 1 }}
                          onChange={(event) => handleChangeParam(index, "value", event)}
                          value={value}
                          inputProps={{ "data-id": id }}
                        />
                        {params.length > 0 && (
                          <IconButton color="warning" sx={styles.iconButtonDelete} value={id as string} onClick={handleDeleteParam}>
                            <RemoveCircleRoundedIcon />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Stack>

                  <Typography sx={{ textDecoration: "underline" }} pb={1}>
                    {t("form:dataMapping")}
                  </Typography>
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
                </Stack>
              )}

              {selectAncestorName && (
                <AssignValueToChildren
                  ancestorName={selectAncestorName}
                  onChange={handleValueFromAncestor}
                  value={defaultValueFromAncestor}
                  currentTypeField={type}
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
