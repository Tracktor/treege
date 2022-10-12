import { ReactNode, useMemo, useReducer, useState } from "react";
import { treeDefaultValue, TreegeContext } from "@/features/Treege/context/TreegeContext";
import treeReducer from "@/features/Treege/reducer/treeReducer";

interface TreegeProviderProps {
  children: ReactNode;
}

const TreegeProvider = ({ children }: TreegeProviderProps) => {
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

  return <TreegeContext.Provider value={value}>{children}</TreegeContext.Provider>;
};

export default TreegeProvider;
