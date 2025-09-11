import { KeyboardArrowDown } from "@mui/icons-material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
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
} from "@tracktor/design-system";
import type { Params } from "@tracktor/types-treege";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  onChangeUrlSelect?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onChangeSearchKey?: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onAddParams?: () => void;
  onChangeParams?: <K extends keyof Params>(index: number, property: K, value: Params[K]) => void;
  onDeleteParams?: (e: MouseEvent<HTMLButtonElement>) => void;
  onChangeApiMapping?: (property: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCollapseOptions?: Dispatch<SetStateAction<boolean>>;
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
  onChangeSearchKey,
  onChangeUrlSelect,
  onAddParams,
  onChangeParams,
  onDeleteParams,
  onChangeApiMapping,
  setCollapseOptions,
}: ApiFieldsConfigAccordionProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const getApiParamIndex = useCallback((key: string) => apiParams?.findIndex((p) => p.key === key) ?? -1, [apiParams]);
  const queryParams = apiParams?.filter((param) => !sliceUrlParams?.includes(param.key));
  const slicedParams = apiParams?.filter((param) => sliceUrlParams?.includes(param.key));

  useEffect(() => {
    if (sliceUrlParams?.length && onAddParams) {
      const paramsToAdd = sliceUrlParams.filter((param) => !apiParams?.some(({ key }) => key === param));

      if (paramsToAdd.length) {
        paramsToAdd.forEach((param) => {
          const realIndex = apiParams?.length ?? 0;
          onAddParams();
          onChangeParams?.(realIndex, "key", param);
        });
      }
    }
  }, [sliceUrlParams, apiParams, onAddParams, onChangeParams]);

  return (
    <Stack marginY={3}>
      <Grid container spacing={1} width="100%" alignItems="center">
        <Grid size={isAutocomplete ? 7 : 12}>
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
            onChange={onChangeUrlSelect}
            value={url || ""}
            onClick={(e) => e.stopPropagation()}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
            }}
          />
        </Grid>

        {isAutocomplete && (
          <Grid size={5}>
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
                onChange={onChangeSearchKey}
                value={searchKey || ""}
                onClick={(e) => e.stopPropagation()}
              />
            </Stack>
          </Grid>
        )}
      </Grid>
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-ancestor-control" id="panel-ancestor-control-header">
          <Typography>{t("advancedConfiguration")}</Typography>
        </AccordionSummary>
        <Divider />

        <AccordionDetails>
          <>
            {sliceUrlParams?.length ? (
              <Stack spacing={1} position="relative" pb={1}>
                {slicedParams?.map(({ key, ancestorUuid, id }, index) => (
                  <Grid container key={key} alignItems="center" spacing={1} alignContent="center">
                    <Grid size={4}>
                      <Typography variant="h5">{`${key}`}</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Select
                        fullWidth
                        id={id}
                        variant="outlined"
                        size="small"
                        value={ancestorUuid || ""}
                        onChange={({ target }) => onChangeParams?.(index, "ancestorUuid", target.value)}
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
                ))}
              </Stack>
            ) : null}

            <Divider sx={{ ml: -2, mr: -2 }} />

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
                <Grid key={id} container pb={2} justifyContent="space-between" alignItems="center" padding={1} spacing={1}>
                  <Grid size={6}>
                    <Tooltip title={useAncestorValue ? t("form:keyPathApiDescription") : ""}>
                      <TextField
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

                  {!!ancestors.length && (
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
              );
            })}

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
