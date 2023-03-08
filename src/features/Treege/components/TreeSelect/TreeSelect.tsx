import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Box,
  Divider,
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@tracktor/design-system";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useTreeSelect from "@/features/Treege/components/TreeSelect/useTreeSelect";

interface TreeSelectProps {
  arrowOnly?: boolean;
  size?: FormControlProps["size"];
  required?: boolean;
  showBtnAddNewTree?: boolean;
  value?: string;
  onChange?: (event: SelectChangeEvent) => void;
}

const styles = {
  formControl: {
    flex: 1,
  },
  select: {
    ".MuiOutlinedInput-notchedOutline": { border: 0, paddingLeft: 5 },
    ".MuiSelect-select": { opacity: 0, width: 0 },
    boxShadow: "none",
  },
};

const TreeSelect = ({ arrowOnly, required, size, showBtnAddNewTree, onChange, value }: TreeSelectProps) => {
  const { t } = useTranslation("form");
  const isControlled = useMemo(() => !!onChange, [onChange]);
  const { handleChangeTree, handleOnOpen, workflowsSuggestions, workflowsSuggestionsLoading, treeSelected } = useTreeSelect(isControlled);

  return (
    <FormControl size={size} required={required} sx={styles.formControl}>
      {!arrowOnly && <InputLabel>{t("tree")}</InputLabel>}
      <Select
        value={isControlled ? value : treeSelected}
        id="tree-select"
        onChange={(e) => (isControlled ? onChange?.(e) : handleChangeTree(e))}
        sx={arrowOnly ? styles.select : undefined}
        label={t("tree")}
        onOpen={handleOnOpen}
      >
        {workflowsSuggestionsLoading && (
          <MenuItem>
            <Skeleton width="100%" />
          </MenuItem>
        )}
        {workflowsSuggestions?.map(({ label: treeLabel, id: treeId }) => (
          <MenuItem key={treeId} value={treeId}>
            {treeLabel}
          </MenuItem>
        ))}
        {showBtnAddNewTree && (
          <MenuItem disabled>
            <Box sx={{ height: 1, width: "100%" }}>
              <Divider />
            </Box>
          </MenuItem>
        )}
        {showBtnAddNewTree && (
          <MenuItem value="add-new-tree">
            <Typography mr={1}>{t("newTree")}</Typography>
            <AddRoundedIcon color="primary" />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default TreeSelect;
