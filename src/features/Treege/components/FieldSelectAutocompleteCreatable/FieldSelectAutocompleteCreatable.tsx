import { Autocomplete, createFilterOptions, TextField } from "@tracktor/design-system";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import useTreegeContext from "@/hooks/useTreegeContext";
import getUniqueTagsInTree from "@/utils/tree/getUniqueTagsInTree/getUniqueTagsInTree";

interface TagOption {
  inputValue: string;
  label: string;
}

const filter = createFilterOptions<TagOption | string>();

interface FieldSelectAutocompleteCreatableProps {
  value: string | null;
  onChange?: (_: SyntheticEvent<Element, Event>, newValue: string | TagOption | null) => void;
}

const FieldSelectAutocompleteCreatable = ({ value, onChange }: FieldSelectAutocompleteCreatableProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { tree } = useTreegeContext();
  const treeTags = getUniqueTagsInTree(tree).reduce((acc, tag) => [...acc, { inputValue: tag, label: tag }], [] as TagOption[]);

  return (
    <Autocomplete
      freeSolo
      fullWidth
      value={value}
      onChange={onChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => typeof option !== "string" && inputValue === option.label);

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            label: `${t("add")} "${inputValue}"`,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option: string | TagOption) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => (
        <li
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        >
          {typeof option !== "string" && option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label={t("tag")}
        />
      )}
      options={treeTags}
    />
  );
};

export default FieldSelectAutocompleteCreatable;
