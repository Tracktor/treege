import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { appendTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useTreeCardContainer = () => {
  const { dispatch } = useContext(DecisionTreeGeneratorContext);
  const handleOnAddChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    const { name } = hierarchyPointNode?.data || {};
    const children = [
      {
        attributes: {
          depth: hierarchyPointNode.depth + 1,
          disable: false,
          required: true,
          type: "",
        },
        children: [],
        name: `${name}${hierarchyPointNode.depth + 1}`,
      },
    ];

    dispatch(appendTreeCard(name, children));
  };

  return { handleOnAddChildren };
};
export default useTreeCardContainer;
