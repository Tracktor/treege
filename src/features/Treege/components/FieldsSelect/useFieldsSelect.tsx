import { useCallback, useContext } from "react";
import fields from "@/constants/fields";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useFieldsSelect = () => {
  const { endPoint } = useContext(TreegeContext);

  const getFields = useCallback(() => fields.filter((field) => !endPoint && field.type !== "tree"), [endPoint]);

  return { fields: getFields() };
};

export default useFieldsSelect;
