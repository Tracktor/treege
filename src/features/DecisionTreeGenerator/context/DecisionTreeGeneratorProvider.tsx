import { ReactNode, useMemo, useReducer } from "react";
import { DecisionTreeGeneratorContext, treeDefaultValue } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import treeReducer from "@/features/DecisionTreeGenerator/reducer/treeReducer";

interface DecisionTreeGeneratorContextProviderProps {
  children: ReactNode;
}

const DecisionTreeGeneratorContextProvider = ({ children }: DecisionTreeGeneratorContextProviderProps) => {
  const [tree, dispatch] = useReducer(treeReducer, treeDefaultValue.tree);
  const value = useMemo(() => ({ dispatch, tree }), [tree]);

  return <DecisionTreeGeneratorContext.Provider value={value}>{children}</DecisionTreeGeneratorContext.Provider>;
};

export default DecisionTreeGeneratorContextProvider;
