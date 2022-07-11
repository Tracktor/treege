import { ReactNode, useMemo, useReducer, useState } from "react";
import { DecisionTreeGeneratorContext, treeDefaultValue } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import treeReducer from "@/features/DecisionTreeGenerator/reducer/treeReducer";

interface DecisionTreeGeneratorContextProviderProps {
  children: ReactNode;
}

const DecisionTreeGeneratorContextProvider = ({ children }: DecisionTreeGeneratorContextProviderProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tree, dispatchTree] = useReducer(treeReducer, treeDefaultValue.tree);
  const value = useMemo(() => ({ dispatchTree, modalIsOpen, setModalIsOpen, tree }), [modalIsOpen, tree]);

  return <DecisionTreeGeneratorContext.Provider value={value}>{children}</DecisionTreeGeneratorContext.Provider>;
};

export default DecisionTreeGeneratorContextProvider;
