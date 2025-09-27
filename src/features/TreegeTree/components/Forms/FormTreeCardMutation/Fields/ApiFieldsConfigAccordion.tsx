import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import AddLinkOutlinedIcon from "@mui/icons-material/AddLinkOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WebhookIcon from "@mui/icons-material/Webhook";
import {
  Box,
  Checkbox,
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
  Popover,
  Button,
} from "@tracktor/design-system";
import type { Params } from "@tracktor/types-treege";
import { ChangeEvent, MouseEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
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
  apiMapping?: RouteMapping;
  initialQuery?: boolean;
  onChangeUrlSelect?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onChangeSearchKey?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onAddParams?: () => void;
  onChangeParams?: <K extends keyof Params>(index: number, property: K, value: Params[K]) => void;
  onDeleteParams?: (e: MouseEvent<HTMLButtonElement> | string) => void;
  onChangeApiMapping?: (property: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  apiMapping,
  initialQuery,
  onChangeSearchKey,
  onChangeUrlSelect,
  onAddParams,
  onChangeParams,
  onDeleteParams,
  onChangeApiMapping,
  onChangeType,
  onChangeInitialQuery,
}: ApiFieldsConfigAccordionProps) => {
  const anchorRef = useRef(null);
  const { t } = useTranslation(["translation", "form"]);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>("");
  const [newAncestor, setNewAncestor] = useState<string>("");

  const getApiParamIndex = useCallback((key: string) => apiParams?.findIndex((p) => p.key === key) ?? -1, [apiParams]);
  const queryParams = apiParams?.filter((param) => !sliceUrlParams?.includes(param.key));
  const slicedParams = apiParams?.filter((param) => sliceUrlParams?.includes(param.key));

  const autocompleteField = fields.find((field) => field.type === "autocomplete") || fields[0];
  const dynamicSelectField = fields.find((field) => field.type === "dynamicSelect") || fields[0];

  const handleNewUrlParam = () => {
    if (!newKey) return;

    const newUrl = url?.endsWith("/") ? `${url}{${newKey}}` : `${url}/{${newKey}}`;

    const fakeEvent = {
      target: { value: newUrl },
    } as ChangeEvent<HTMLInputElement>;

    onChangeUrlSelect?.(fakeEvent);

    const realIndex = apiParams?.length ?? 0;
    onAddParams?.();
    onChangeParams?.(realIndex, "key", `{${newKey}}`);
    if (newAncestor) {
      onChangeParams?.(realIndex, "ancestorUuid", newAncestor);
    }
    setNewKey("");
    setNewAncestor("");
    setTooltipOpen(false);
  };

  const handleChangeType = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChangeType?.(event, autocompleteField);
      return;
    }
    onChangeType?.(event, dynamicSelectField);
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
          const hasPlaceholderFormat = /^\{[^}]+\}$/.test(key.trim());
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
        slotProps={{
          input: {
            endAdornment: ancestors.length ? (
              <InputAdornment position="end">
                <Popover
                  open={tooltipOpen}
                  anchorEl={anchorRef.current}
                  onClose={() => {
                    setTooltipOpen(false);
                    setNewKey("");
                    setNewAncestor("");
                  }}
                  anchorOrigin={{
                    horizontal: "center",
                    vertical: "top",
                  }}
                  transformOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                  }}
                >
                  <Stack p={2} width={400}>
                    <Stack spacing={1} mb={2} direction="row">
                      <TextField
                        required
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        label="key"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Select
                        fullWidth
                        required
                        id="new-param-ancestor"
                        variant="outlined"
                        size="xSmall"
                        value={newAncestor}
                        onChange={({ target }) => setNewAncestor(target.value)}
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
                    </Stack>

                    <Button variant="contained" fullWidth onClick={handleNewUrlParam}>
                      {t("add")}
                    </Button>
                  </Stack>
                </Popover>

                <Tooltip title={t("form:addUrlVariable")} placement="top" arrow>
                  <IconButton
                    ref={anchorRef}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTooltipOpen(!tooltipOpen);
                    }}
                  >
                    <AddLinkOutlinedIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : (
              <Tooltip title={t("form:addParentsBeforeIntegrateUrlVariable")} placement="top" arrow>
                <IconButton ref={anchorRef} size="small">
                  <AddLinkOutlinedIcon color="disabled" />
                </IconButton>
              </Tooltip>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <WebhookIcon />
              </InputAdornment>
            ),
          },
        }}
        placeholder="https://api.com/"
        type="url"
        onChange={onChangeUrlSelect}
        value={url || ""}
        onClick={(e) => e.stopPropagation()}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      />

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>{t("advancedConfiguration")}</Typography>
            {ancestors?.length ? (
              <Stack mt={2} mb={1}>
                <Tooltip title={t("form:apiConfigDescription")} placement="right" arrow>
                  <InfoOutlinedIcon fontSize="small" color="primary" />
                </Tooltip>
              </Stack>
            ) : null}
          </Stack>
        </AccordionSummary>

        <Divider />

        <AccordionDetails>
          <>
            {ancestors?.length && sliceUrlParams?.length ? (
              <>
                <Stack spacing={1} position="relative" paddingY={2}>
                  <Typography variant="h5" pb={1} color="text.secondary">
                    {t("form:URlVariables")} :
                  </Typography>
                  {slicedParams?.map(({ key, ancestorUuid, id }) => {
                    const realIndex = getApiParamIndex(key);

                    return (
                      <Grid container key={key} alignItems="center" spacing={1} alignContent="center">
                        <Grid size={6} alignItems="center" textAlign="center" spacing={1}>
                          <Typography variant="h5">{`${key}`}</Typography>
                        </Grid>
                        <Grid size={6}>
                          <Select
                            fullWidth
                            id={id}
                            variant="outlined"
                            size="xSmall"
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
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
                <Divider sx={{ ml: -2, mr: -2 }} />
              </>
            ) : null}

            <>
              <Stack direction="column" spacing={1} paddingY={2}>
                <Typography variant="h5" color="text.secondary">
                  {t("form:variant", { variant: isAutocomplete ? "Autocomplete" : "Select" })}
                </Typography>
                <Stack direction="row" spacing={4}>
                  <FormGroup>
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
              </Stack>
              <Divider sx={{ mb: 1, ml: -2, mr: -2 }} />
            </>

            <Stack direction="column" paddingY={2} spacing={2}>
              <Typography variant="h5" sx={{ ml: 1 }} color="text.secondary">
                {t("form:optionConfig")} :
              </Typography>

              <Stack spacing={2}>
                <TextField
                  required
                  id="labelPath"
                  size="small"
                  sx={{ flex: 1 }}
                  label="Label"
                  value={apiMapping?.label || ""}
                  onChange={(event) => onChangeApiMapping?.("label", event)}
                  placeholder="client.name"
                  type="text"
                />

                <TextField
                  required
                  id="valuePath"
                  size="small"
                  label="Value"
                  value={apiMapping?.value || ""}
                  onChange={(event) => onChangeApiMapping?.("value", event)}
                  placeholder="client.id"
                  type="text"
                />
                <TextField
                  id="imagePath"
                  size="small"
                  label="Image"
                  value={apiMapping?.image || ""}
                  onChange={(event) => onChangeApiMapping?.("image", event)}
                  placeholder="client.src.profile"
                  type="text"
                />
              </Stack>
            </Stack>

            <Divider sx={{ mb: 1, ml: -2, mr: -2, mt: 1 }} />

            <Stack spacing={1} paddingY={2} direction={{ sm: "row", xs: "column" }} alignItems={{ sm: "center", xs: "flex-start" }}>
              <Typography variant="h5" color="text.secondary">
                {t("form:queryParams")}
              </Typography>
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
          </>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default ApiFieldsConfigAccordion;
