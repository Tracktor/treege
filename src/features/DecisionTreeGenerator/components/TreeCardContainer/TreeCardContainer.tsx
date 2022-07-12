import type { CustomNodeElementProps } from "react-d3-tree/lib/types/common";
import TreeCard from "@/components/ui/TreeCard/TreeCard";
import useTreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/useTreeCardContainer";

const TreeCardContainerConsumer = ({
  nodeDatum,
  hierarchyPointNode,
  toggleNode,
  onNodeClick,
  onNodeMouseOver,
  onNodeMouseOut,
}: CustomNodeElementProps) => {
  const { handleDeleteChildren, handleMutationChildren } = useTreeCardContainer();

  return (
    <TreeCard
      nodeDatum={nodeDatum}
      hierarchyPointNode={hierarchyPointNode}
      toggleNode={toggleNode}
      onNodeClick={onNodeClick}
      onNodeMouseOver={onNodeMouseOver}
      onNodeMouseOut={onNodeMouseOut}
      onAddChildren={handleMutationChildren}
      onDeleteChildren={handleDeleteChildren}
      onEditChildren={handleMutationChildren}
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
