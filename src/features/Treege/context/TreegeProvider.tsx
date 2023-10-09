import { ReactNode, useMemo, useReducer, useState } from "react";
import { treeDefaultValue, TreegeContext } from "@/features/Treege/context/TreegeContext";
import treeReducer, { setTree } from "@/features/Treege/reducer/treeReducer";
import { BackendConfig } from "@/features/Treege/Treege";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import { version } from "~/package.json";

interface TreegeProviderProps {
  children: ReactNode;
  initialTree?: TreeNode;
  initialTreeId?: string;
  backendConfig?: BackendConfig;
}

const TreegeProvider = ({ children, initialTree, initialTreeId, backendConfig }: TreegeProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [treeModalOpen, setTreeModalOpen] = useState(treeDefaultValue.treeModalOpen);
  const [treePath, setTreePath] = useState(treeDefaultValue.treePath);
  const [tree, dispatchTree] = useReducer(treeReducer, initialTree || treeDefaultValue.tree);
  const [currentTree, setCurrentTree] = useState(
    initialTreeId ? { ...treeDefaultValue.currentTree, id: initialTreeId } : treeDefaultValue.currentTree,
  );

  const value = useMemo(
    () => ({
      backendConfig: {
        baseUrl: treeDefaultValue?.backendConfig?.baseUrl || "",
        ...treeDefaultValue.backendConfig,
        ...backendConfig,
        endpoints: {
          ...treeDefaultValue.backendConfig?.endpoints,
          ...backendConfig?.endpoints,
        },
      },
      currentHierarchyPointNode,
      currentTree,
      dispatchTree,
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
    [backendConfig, currentHierarchyPointNode, currentTree, modalOpen, tree, treeModalOpen, treePath],
  );

  // Fetch initial tree
  useWorkflowQuery(currentTree.id, {
    enabled: !!initialTreeId,
    onSuccess: async (response) => {
      if (!response) {
        return;
      }

      setCurrentTree({ id: response?.id, name: response?.label });
      dispatchTree(setTree(response?.workflow || null));
    },
  });

  return <TreegeContext.Provider value={value}>{children}</TreegeContext.Provider>;
};

export default TreegeProvider;
