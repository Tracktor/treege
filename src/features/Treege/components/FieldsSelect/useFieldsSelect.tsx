import { useCallback, useContext } from "react";
import fields from "@/constants/fields";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useFieldsSelect = () => {
  const { endPoint } = useContext(TreegeContext);

  const getFields = useCallback(() => fields.filter((field) => !(field.type === "tree" && !endPoint)), [endPoint]);

  return { fields: getFields() };
};

export default useFieldsSelect;
