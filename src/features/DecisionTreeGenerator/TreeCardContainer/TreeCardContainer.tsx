import type { CustomNodeElementProps } from "react-d3-tree/lib/types/common";
import TreeCard from "@/components/ui/TreeCard/TreeCard";
import useTreeCardContainer from "@/features/DecisionTreeGenerator/TreeCardContainer/useTreeCardContainer";

const TreeCardContainerConsumer = ({
  nodeDatum,
  hierarchyPointNode,
  toggleNode,
  onNodeClick,
  onNodeMouseOver,
  onNodeMouseOut,
}: CustomNodeElementProps) => {
  const { handleOnAddChildren } = useTreeCardContainer();

  return (
    <TreeCard
      nodeDatum={nodeDatum}
      hierarchyPointNode={hierarchyPointNode}
      toggleNode={toggleNode}
      onNodeClick={onNodeClick}
      onNodeMouseOver={onNodeMouseOver}
      onNodeMouseOut={onNodeMouseOut}
      onAddChildren={(e) => handleOnAddChildren(e, handleOnAddChildren)}
    />
  );
};

const TreeCardContainer = ({
  nodeDatum,
  hierarchyPointNode,
  toggleNode,
  onNodeClick,
  onNodeMouseOver,
  onNodeMouseOut,
}: CustomNodeElementProps) => (
  <TreeCardContainerConsumer
    nodeDatum={nodeDatum}
    hierarchyPointNode={hierarchyPointNode}
    toggleNode={toggleNode}
    onNodeClick={onNodeClick}
    onNodeMouseOver={onNodeMouseOver}
    onNodeMouseOut={onNodeMouseOut}
  />
);

export default TreeCardContainer;
