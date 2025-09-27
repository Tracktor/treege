import type { CurrentTree, ModalType, TreeNode, TreePath } from "@tracktor/types-treege";
import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useReducer, useState } from "react";
import { BackendConfig } from "@/features/Treege";
import treeReducer, { setTree, TreeReducerAction } from "@/features/TreegeTree/reducer/treeReducer";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import { version } from "~/package.json";

interface TreegeProviderProps {
  children: ReactNode;
  initialTree?: TreeNode;
  initialTreeId?: string;
  backendConfig?: BackendConfig;
}

export interface TreeDefaultValue {
  /**
   * This is the backend configuration
   */
  backendConfig?: BackendConfig;
  /**
   * CurrentHierarchyPointNode is the current node selected
   */
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  /**
   * This is the current tree information
   * {
   *     "id": "treeId",
   *     "name": "Tree name"
   * }
   */
  currentTree: CurrentTree;
  /**
   * This is the tree node object
   */
  tree: null | TreeNode;
  /**
   * This is the tree modal open state
   */
  treeModalOpen: boolean;
  /**
   * This is the tree path
   * [
   *     {
   *         "label": "Tree name",
   *         "path": "uuid"
   *     }
   * ]
   */
  treePath: TreePath[] | [];
  /**
   * This is the modal open state
   */
  modalOpen: ModalType;
  /**
   * This is the version of Treege
   */
  version: string;
  /**
   * This is the tree node dispatch function
   * @param state
   */
  dispatchTree: Dispatch<TreeReducerAction>;
  /**
   * This is the function to set the modal open state
   * @param state
   */
  setCurrentHierarchyPointNode(state: SetStateAction<null | HierarchyPointNode<TreeNode>>): void;
  /**
   * This is the function to set the current tree information,
   * Not the node to display a tree
   * @param state
   */
  setCurrentTree(state: SetStateAction<CurrentTree>): void;
  /**
   * This is the function to set the modal open state
   * @param state
   */
  setModalOpen(state: SetStateAction<ModalType>): void;
  /**
   * This is the function to set the modal open state
   * @param state
   */
  setTreeModalOpen(state: SetStateAction<boolean>): void;
  /**
   * This is the function to set the tree path
   * @param state
   */
  setTreePath(state: SetStateAction<TreePath[] | []>): void;
}

export const treeDefaultValue: TreeDefaultValue = {
  backendConfig: {
    baseUrl: "",
    endpoints: {
      workflow: "/v1/workflow",
      workflows: "/v1/workflows",
    },
  },
  currentHierarchyPointNode: null,
  currentTree: {
    errorName: "",
    id: "",
    name: "",
  },
  dispatchTree: () => null,
  modalOpen: null,
  setCurrentHierarchyPointNode: () => null,
  setCurrentTree: () => null,
  setModalOpen: () => null,
  setTreeModalOpen: () => null,
  setTreePath: () => null,
  tree: null,
  treeModalOpen: false,
  treePath: [],
  version: "",
};

export const TreegeContext = createContext<TreeDefaultValue>(treeDefaultValue);

const TreegeProvider = ({ children, initialTree, initialTreeId, backendConfig }: TreegeProviderProps) => {
  const { data } = useWorkflowQuery(initialTreeId, { enabled: !!initialTreeId });
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [treeModalOpen, setTreeModalOpen] = useState(treeDefaultValue.treeModalOpen);
  const [treePath, setTreePath] = useState(treeDefaultValue.treePath);
  const [tree, dispatchTree] = useReducer(treeReducer, initialTree || treeDefaultValue.tree);

  const [currentTree, setCurrentTree] = useState(
    initialTreeId ? { ...treeDefaultValue.currentTree, id: initialTreeId } : treeDefaultValue.currentTree,
  );

  /**
   * Set the initial tree if it is provided
   */
  useEffect(() => {
    if (data) {
      setCurrentTree({ id: data.id, name: data.label });
      dispatchTree(setTree(data.workflow || null));
    }
  }, [data]);

  const value = useMemo(
    () => ({
      backendConfig: {
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

  return <TreegeContext.Provider value={value}>{children}</TreegeContext.Provider>;
};

export default TreegeProvider;
