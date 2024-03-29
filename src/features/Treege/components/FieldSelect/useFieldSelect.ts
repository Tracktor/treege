import { useCallback } from "react";
import fields from "@/constants/fields";
import useTreegeContext from "@/hooks/useTreegeContext";

const useFieldSelect = () => {
  const { backendConfig } = useTreegeContext();

  const getFields = useCallback(
    () => fields.filter((field) => !(field.type === "tree" && !backendConfig?.baseUrl)),
    [backendConfig?.baseUrl],
  );

  return { fields: getFields() };
};

export default useFieldSelect;
