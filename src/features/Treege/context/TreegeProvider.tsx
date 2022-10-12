import { ReactNode, useMemo, useReducer, useState } from "react";
import { treeDefaultValue, TreegeContext } from "@/features/Treege/context/TreegeContext";
import treeReducer from "@/features/Treege/reducer/treeReducer";

interface TreegeProviderProps {
  children: ReactNode;
  endPoint?: string;
}

const TreegeProvider = ({ children, endPoint: endPointProps }: TreegeProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [treeModalOpen, setTreeModalOpen] = useState(treeDefaultValue.treeModalOpen);
  const [treePath, setTreePath] = useState(treeDefaultValue.treePath);
  const [endPoint, setEndPoint] = useState(endPointProps || treeDefaultValue.endPoint);
  const [tree, dispatchTree] = useReducer(treeReducer, treeDefaultValue.tree);

  const value = useMemo(
    () => ({
      currentHierarchyPointNode,
      dispatchTree,
      endPoint,
      modalOpen,
      setCurrentHierarchyPointNode,
      setEndPoint,
      setModalOpen,
      setTreeModalOpen,
      setTreePath,
      tree,
      treeModalOpen,
      treePath,
    }),
    [currentHierarchyPointNode, modalOpen, treeModalOpen, treePath, tree, endPoint, setEndPoint]
  );

  return <TreegeContext.Provider value={value}>{children}</TreegeContext.Provider>;
};

export default TreegeProvider;
