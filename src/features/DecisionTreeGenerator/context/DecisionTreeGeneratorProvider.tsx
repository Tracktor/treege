import { ReactNode, useMemo, useReducer, useState } from "react";
import { DecisionTreeGeneratorContext, treeDefaultValue } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import treeReducer from "@/features/DecisionTreeGenerator/reducer/treeReducer";

interface DecisionTreeGeneratorContextProviderProps {
  children: ReactNode;
}

const DecisionTreeGeneratorContextProvider = ({ children }: DecisionTreeGeneratorContextProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalMutationIsOpen, setModalMutationIsOpen] = useState(treeDefaultValue.modalMutationIsOpen);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(treeDefaultValue.modalDeleteIsOpen);
  const [tree, dispatchTree] = useReducer(treeReducer, treeDefaultValue.tree);

  const value = useMemo(
    () => ({
      currentHierarchyPointNode,
      dispatchTree,
      modalDeleteIsOpen,
      modalMutationIsOpen,
      setCurrentHierarchyPointNode,
      setModalDeleteIsOpen,
      setModalMutationIsOpen,
      tree,
    }),
    [currentHierarchyPointNode, modalDeleteIsOpen, modalMutationIsOpen, tree]
  );

  return <DecisionTreeGeneratorContext.Provider value={value}>{children}</DecisionTreeGeneratorContext.Provider>;
};

export default DecisionTreeGeneratorContextProvider;
