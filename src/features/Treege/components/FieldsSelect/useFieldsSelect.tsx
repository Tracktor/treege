import { useCallback } from "react";
import fields from "@/constants/fields";
import useTreegeContext from "@/hooks/useTreegeContext";

const useFieldsSelect = () => {
  const { endPoint } = useTreegeContext();

  const getFields = useCallback(() => fields.filter((field) => !(field.type === "tree" && !endPoint)), [endPoint]);

  return { fields: getFields() };
};

export default useFieldsSelect;
