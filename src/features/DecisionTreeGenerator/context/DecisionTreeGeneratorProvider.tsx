import { ReactNode, useMemo, useReducer, useState } from "react";
import { DecisionTreeGeneratorContext, treeDefaultValue } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import treeReducer from "@/features/DecisionTreeGenerator/reducer/treeReducer";

interface DecisionTreeGeneratorContextProviderProps {
  children: ReactNode;
}

const DecisionTreeGeneratorContextProvider = ({ children }: DecisionTreeGeneratorContextProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [treeModalOpen, setTreeModalOpen] = useState(treeDefaultValue.treeModalOpen);
  const [treePath, setTreePath] = useState(treeDefaultValue.treePath);
  const [tree, dispatchTree] = useReducer(treeReducer, treeDefaultValue.tree);

  const value = useMemo(
    () => ({
      currentHierarchyPointNode,
      dispatchTree,
      modalOpen,
      setCurrentHierarchyPointNode,
      setModalOpen,
      setTreeModalOpen,
      setTreePath,
      tree,
      treeModalOpen,
      treePath,
    }),
    [currentHierarchyPointNode, modalOpen, treeModalOpen, treePath, tree]
  );

  return <DecisionTreeGeneratorContext.Provider value={value}>{children}</DecisionTreeGeneratorContext.Provider>;
};

export default DecisionTreeGeneratorContextProvider;
