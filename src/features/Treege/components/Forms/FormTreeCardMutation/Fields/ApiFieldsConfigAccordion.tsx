import { KeyboardArrowDown } from "@mui/icons-material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WebhookIcon from "@mui/icons-material/Webhook";
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormGroup,
} from "@tracktor/design-system";
import type { Params } from "@tracktor/types-treege";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, SyntheticEvent, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";

interface RouteMapping {
  object: string;
  label: string;
  value: string;
  image: string;
}

interface ApiFieldsConfigAccordionProps {
  isAutocomplete?: boolean;
  url?: string;
  searchKey?: string;
  sliceUrlParams?: string[];
  apiParams?: Params[];
  ancestors: { uuid: string; name?: string }[];
  collapseOptions?: boolean;
  apiMapping?: RouteMapping;
  initialQuery?: boolean;
  onChangeUrlSelect?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onChangeSearchKey?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onAddParams?: () => void;
  onChangeParams?: <K extends keyof Params>(index: number, property: K, value: Params[K]) => void;
  onDeleteParams?: (e: MouseEvent<HTMLButtonElement> | string) => void;
  onChangeApiMapping?: (property: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCollapseOptions?: Dispatch<SetStateAction<boolean>>;
  onChangeType?: (_: SyntheticEvent, value: (typeof fields)[number]) => void;
  onChangeInitialQuery?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
}

const ApiFieldsConfigAccordion = ({
  isAutocomplete,
  url,
  searchKey,
  sliceUrlParams,
  apiParams,
  ancestors,
  collapseOptions,
  apiMapping,
  initialQuery,
  onChangeSearchKey,
  onChangeUrlSelect,
  onAddParams,
  onChangeParams,
  onDeleteParams,
  onChangeApiMapping,
  setCollapseOptions,
  onChangeType,
  onChangeInitialQuery,
}: ApiFieldsConfigAccordionProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const getApiParamIndex = useCallback((key: string) => apiParams?.findIndex((p) => p.key === key) ?? -1, [apiParams]);
  const queryParams = apiParams?.filter((param) => !sliceUrlParams?.includes(param.key));
  const slicedParams = apiParams?.filter((param) => sliceUrlParams?.includes(param.key));

  const autocompleteField = fields.find((field) => field.type === "autocomplete") || fields[0];
  const dynamicSelectField = fields.find((field) => field.type === "dynamicSelect") || fields[0];

  const handleChangeType = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChangeType?.(event as any, autocompleteField);
      return;
    }
    onChangeType?.(event as any, dynamicSelectField);
  };

  useEffect(() => {
    if (onAddParams || onDeleteParams) {
      // Auto-add of missing params
      if (sliceUrlParams?.length && onAddParams) {
        const paramsToAdd = sliceUrlParams.filter((param) => !apiParams?.some(({ key }) => key === param));

        if (paramsToAdd.length) {
          paramsToAdd.forEach((param) => {
            const realIndex = apiParams?.length ?? 0;
            onAddParams(); // create a new row
            onChangeParams?.(realIndex, "key", param); // set its key value
          });
        }
      }

      // Auto-delete of removed or invalid params
      if (apiParams?.length && onDeleteParams) {
        const paramsToDelete = apiParams.filter(({ key }) => {
          // Check if the key is in {placeholder} format and not in the URL anymore
          const hasPlaceholderFormat = /^\{.+$/.test(key.trim());
          const notInUrl = !sliceUrlParams?.includes(key);

          return hasPlaceholderFormat && notInUrl;
        });

        if (paramsToDelete.length) {
          paramsToDelete.forEach(({ id }) => {
            onDeleteParams(id);
          });
        }
      }
    }
  }, [sliceUrlParams, apiParams, onAddParams, onChangeParams, onDeleteParams]);

  return (
    <Stack marginY={3}>
      <TextField
        id="urlSelect"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <WebhookIcon />
            </InputAdornment>
          ),
        }}
        placeholder="https://api.com/"
        type="url"
        onChange={onChangeUrlSelect}
        value={url || ""}
        onClick={(e) => e.stopPropagation()}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        }}
      />

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-ancestor-control" id="panel-ancestor-control-header">
          <Typography>{t("advancedConfiguration")}</Typography>
        </AccordionSummary>
        <Divider />

        <AccordionDetails>
          <>
            {sliceUrlParams?.length ? (
              <>
                <Stack spacing={1} position="relative" pb={1}>
                  {slicedParams?.map(({ key, ancestorUuid, id, staticValue }) => {
                    const realIndex = getApiParamIndex(key);

                    return (
                      <Grid container key={key} alignItems="center" spacing={1} alignContent="center">
                        <Grid size={4} alignItems="center" textAlign="center" spacing={1}>
                          <Typography variant="h5">{`${key}`}</Typography>
                        </Grid>
                        <Grid size={8}>
                          {ancestors?.length ? (
                            <Select
                              fullWidth
                              id={id}
                              variant="outlined"
                              size="small"
                              value={ancestorUuid || ""}
                              onChange={({ target }) => onChangeParams?.(realIndex, "ancestorUuid", target.value)}
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
                              fullWidth
                              required
                              value={staticValue || ""}
                              onChange={({ target }) => onChangeParams?.(realIndex, "staticValue", target.value)}
                            />
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
                <Divider sx={{ ml: -2, mr: -2 }} />
              </>
            ) : null}

            <>
              <Stack direction="row" spacing={4} alignItems="center" paddingY={2}>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox id="isAutocomplete" checked={isAutocomplete} onChange={handleChangeType} />}
                    label={t("activateSearch")}
                  />
                  {isAutocomplete && (
                    <FormControlLabel
                      control={<Checkbox id="isInitialQuery" checked={initialQuery} onChange={onChangeInitialQuery} />}
                      label={t("initialQueryEnable")}
                    />
                  )}
                </FormGroup>
                {isAutocomplete && (
                  <TextField
                    required
                    id="searchKey"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1, minWidth: 0 }}
                    placeholder={t("form:searchKeyPlaceholder")}
                    type="text"
                    label={t("form:key")}
                    onChange={onChangeSearchKey}
                    value={searchKey || ""}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </Stack>
              <Divider sx={{ mb: 1, ml: -2, mr: -2 }} />
            </>

            <Stack spacing={1} direction={{ sm: "row", xs: "column" }} alignItems={{ sm: "center", xs: "flex-start" }}>
              <Typography variant="h5">{t("form:queryParams")}</Typography>
              <Box justifyContent="flex-end">
                <IconButton
                  color="success"
                  sx={{
                    marginRight: "-20px !important",
                    minWidth: "auto !important",
                  }}
                  onClick={onAddParams}
                >
                  <AddCircleRoundedIcon />
                </IconButton>
              </Box>
            </Stack>

            {queryParams?.map(({ id, key, staticValue, ancestorUuid, useAncestorValue }) => {
              const realIndex = getApiParamIndex(key);

              return (
                <Grid key={id} container pb={2} alignItems="center" padding={1} spacing={1}>
                  <Grid size={6}>
                    <Tooltip title={useAncestorValue ? t("form:keyPathApiDescription") : ""}>
                      <TextField
                        required
                        id={`param-key-${id}`}
                        label="Key"
                        size="small"
                        onChange={({ target }) => onChangeParams?.(realIndex, "key", target.value)}
                        value={key || ""}
                        inputProps={{ "data-id": id }}
                      />
                    </Tooltip>
                  </Grid>

                  <Grid size={6}>
                    {useAncestorValue ? (
                      <Select
                        fullWidth
                        required
                        id={id}
                        variant="outlined"
                        size="small"
                        value={ancestorUuid || ""}
                        onChange={({ target }) => onChangeParams?.(realIndex, "ancestorUuid", target.value)}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
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
                        required
                        id={`param-value-${id}`}
                        label={t("value", { ns: "form" })}
                        size="small"
                        fullWidth
                        onChange={({ target }) => onChangeParams?.(realIndex, "staticValue", target.value)}
                        value={staticValue || ""}
                        inputProps={{ "data-id": id }}
                      />
                    )}
                  </Grid>

                  <Grid size="auto" sx={{ ml: "auto" }} container alignItems="center">
                    {ancestors.length > 0 && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={`useAncestorAsParam-${id}`}
                            disabled={!ancestors.length}
                            checked={useAncestorValue || false}
                            onChange={({ target }) => onChangeParams?.(realIndex, "useAncestorValue", target.checked)}
                          />
                        }
                        label={
                          <Typography variant="body2" color="textSecondary">
                            {t("form:useAncestorValueAsParam")}
                          </Typography>
                        }
                      />
                    )}

                    <IconButton color="error" value={id} onClick={onDeleteParams}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              );
            })}

            <Divider sx={{ mb: 1, ml: -2, mr: -2, mt: 1 }} />

            <Box display="flex" alignItems="center">
              <IconButton
                aria-label={t("form:dataMapping")}
                onClick={() => setCollapseOptions?.((prev) => !prev)}
                sx={{ transform: collapseOptions ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
              >
                <KeyboardArrowDown />
              </IconButton>
              <Typography sx={{ ml: 1 }}>{t("form:dataMapping")}</Typography>
            </Box>

            <Collapse in={collapseOptions}>
              <Stack spacing={1} paddingY={1}>
                <Stack spacing={1} sx={{ pb: 1 }} direction={{ sm: "row", xs: "column" }} alignItems="center">
                  <TextField
                    id="objectArrayPath"
                    size="small"
                    sx={{ flex: 3 }}
                    InputLabelProps={{ shrink: true }}
                    label="Object Array Path"
                    value={apiMapping?.object || ""}
                    onChange={(event) => onChangeApiMapping?.("object", event)}
                    placeholder="elements.features[]"
                    type="text"
                  />
                  <TextField
                    id="labelPath"
                    size="small"
                    sx={{ flex: 3 }}
                    InputLabelProps={{ shrink: true }}
                    label="Label Path"
                    value={apiMapping?.label || ""}
                    onChange={(event) => onChangeApiMapping?.("label", event)}
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
                    value={apiMapping?.value || ""}
                    onChange={(event) => onChangeApiMapping?.("value", event)}
                    placeholder="client.id"
                    type="text"
                  />
                  <TextField
                    id="imagePath"
                    size="small"
                    sx={{ flex: 3 }}
                    InputLabelProps={{ shrink: true }}
                    label="Image Path"
                    value={apiMapping?.image || ""}
                    onChange={(event) => onChangeApiMapping?.("image", event)}
                    placeholder="client.src.profile"
                    type="text"
                  />
                </Stack>
              </Stack>
            </Collapse>
          </>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default ApiFieldsConfigAccordion;
