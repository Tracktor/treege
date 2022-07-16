import { ReactNode, useEffect, useMemo, useReducer, useState } from "react";
import { DecisionTreeGeneratorContext, treeDefaultValue } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import treeReducer, { setTree } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

interface DecisionTreeGeneratorContextProviderProps {
  children: ReactNode;
}

const DecisionTreeGeneratorContextProvider = ({ children }: DecisionTreeGeneratorContextProviderProps) => {
  const [currentHierarchyPointNode, setCurrentHierarchyPointNode] = useState(treeDefaultValue.currentHierarchyPointNode);
  const [modalOpen, setModalOpen] = useState(treeDefaultValue.modalOpen);
  const [tree, dispatchTree] = useReducer(treeReducer, treeDefaultValue.tree);

  const handleMessage = (event: MessageEvent) => {
    if (event.data?.source === "treege" && event.data?.type === "initTree") {
      dispatchTree(setTree(event.data?.tree));
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const value = useMemo(
    () => ({
      currentHierarchyPointNode,
      dispatchTree,
      modalOpen,
      setCurrentHierarchyPointNode,
      setModalOpen,
      tree,
    }),
    [currentHierarchyPointNode, modalOpen, tree]
  );

  return <DecisionTreeGeneratorContext.Provider value={value}>{children}</DecisionTreeGeneratorContext.Provider>;
};

export default DecisionTreeGeneratorContextProvider;
