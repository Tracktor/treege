import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { appendTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useTreeCardContainer = () => {
  const { dispatchTree, setModalIsOpen } = useContext(DecisionTreeGeneratorContext);

  const handleOnAddChildren = () => {
    setModalIsOpen(true);
  };

  const handleOnConfirmAddChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
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

    dispatchTree(appendTreeCard(name, children));
  };

  return { handleOnAddChildren, handleOnConfirmAddChildren };
};
export default useTreeCardContainer;
