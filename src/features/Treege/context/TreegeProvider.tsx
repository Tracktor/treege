import { ReactNode, useMemo, useReducer, useState } from "react";
import { treeDefaultValue, TreegeContext } from "@/features/Treege/context/TreegeContext";
import treeReducer from "@/features/Treege/reducer/treeReducer";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import { version } from "~/package.json";

interface TreegeProviderProps {
  children: ReactNode;
  endPoint?: string;
  initialTree?: TreeNode;
  initialTreeId?: string;
}

const TreegeProvider = ({ children, endPoint, initialTree, initialTreeId }: TreegeProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [treeModalOpen, setTreeModalOpen] = useState(treeDefaultValue.treeModalOpen);
  const [treePath, setTreePath] = useState(treeDefaultValue.treePath);
  const [tree, dispatchTree] = useReducer(treeReducer, initialTree || treeDefaultValue.tree);
  const [currentTree, setCurrentTree] = useState(
    initialTreeId ? { ...treeDefaultValue.currentTree, id: initialTreeId } : treeDefaultValue.currentTree
  );

  const value = useMemo(
    () => ({
      currentHierarchyPointNode,
      currentTree,
      dispatchTree,
      endPoint,
      modalOpen,
      setCurrentHierarchyPointNode,
      setCurrentTree,
      setModalOpen,
      setTreeModalOpen,
      setTreePath,
      tree,
      treeModalOpen,
      treePath,
      version,
    }),
    [currentHierarchyPointNode, modalOpen, treeModalOpen, treePath, tree, currentTree, endPoint]
  );

  return <TreegeContext.Provider value={value}>{children}</TreegeContext.Provider>;
};

export default TreegeProvider;
