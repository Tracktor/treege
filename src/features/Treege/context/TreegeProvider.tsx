import { ReactNode, useMemo, useReducer, useState } from "react";
import { treeDefaultValue, TreegeContext } from "@/features/Treege/context/TreegeContext";
import treeReducer from "@/features/Treege/reducer/treeReducer";
import type { TreeNode } from "@/features/Treege/type/TreeNode";

interface TreegeProviderProps {
  children: ReactNode;
  endPoint?: string;
  initialTree?: TreeNode;
}

const TreegeProvider = ({ children, endPoint, initialTree }: TreegeProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [treeModalOpen, setTreeModalOpen] = useState(treeDefaultValue.treeModalOpen);
  const [treePath, setTreePath] = useState(treeDefaultValue.treePath);
  const [tree, dispatchTree] = useReducer(treeReducer, initialTree || treeDefaultValue.tree);

  const value = useMemo(
    () => ({
      currentHierarchyPointNode,
      dispatchTree,
      endPoint,
      modalOpen,
      setCurrentHierarchyPointNode,
      setModalOpen,
      setTreeModalOpen,
      setTreePath,
      tree,
      treeModalOpen,
      treePath,
    }),
    [currentHierarchyPointNode, modalOpen, treeModalOpen, treePath, tree, endPoint]
  );

  return <TreegeContext.Provider value={value}>{children}</TreegeContext.Provider>;
};

export default TreegeProvider;
