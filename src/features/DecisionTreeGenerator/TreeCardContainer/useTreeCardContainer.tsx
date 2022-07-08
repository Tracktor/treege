import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { addChildrenAction } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useTreeCardContainer = () => {
  const { dispatch } = useContext(DecisionTreeGeneratorContext);

  const handleOnAddChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    dispatch(addChildrenAction(hierarchyPointNode.depth));
  };

  return { handleOnAddChildren };
};
export default useTreeCardContainer;
