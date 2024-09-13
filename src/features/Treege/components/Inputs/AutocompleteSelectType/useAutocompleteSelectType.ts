import fields from "@/constants/fields";
import useTreegeContext from "@/hooks/useTreegeContext";

const useAutocompleteSelectType = (value: any) => {
  const { backendConfig } = useTreegeContext();
  const options = fields.filter((field) => !(field.type === "tree" && !backendConfig?.baseUrl)) || [];
  const currentValue = options.find((option) => option.type === value) || fields[0];

  return {
    currentValue,
    options,
  };
};

export default useAutocompleteSelectType;
