import { ReactNode, useMemo, useState } from "react";
import {
  DecisionTreeGeneratorContext,
  DecisionTreeGeneratorContextDefaultValue,
} from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

interface DecisionTreeGeneratorContextProviderProps {
  children: ReactNode;
}

const DecisionTreeGeneratorContextProvider = ({ children }: DecisionTreeGeneratorContextProviderProps) => {
  const [tree, setTree] = useState(DecisionTreeGeneratorContextDefaultValue.tree);
  const value = useMemo(() => ({ setTree, tree }), [tree]);
  return <DecisionTreeGeneratorContext.Provider value={value}>{children}</DecisionTreeGeneratorContext.Provider>;
};

export default DecisionTreeGeneratorContextProvider;
