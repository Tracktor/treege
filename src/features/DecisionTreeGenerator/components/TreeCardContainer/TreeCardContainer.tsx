import TreeCard from "@/components/ui/TreeCard/TreeCard";
import useTreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/useTreeCardContainer";
import type { TreeCustomNodeElementProps } from "@/features/DecisionTreeGenerator/type/TreeNode";

const TreeCardContainerConsumer = ({
  nodeDatum,
  hierarchyPointNode,
  toggleNode,
  onNodeClick,
  onNodeMouseOver,
  onNodeMouseOut,
}: TreeCustomNodeElementProps) => {
  const { handleDeleteChildren, handleEditChildren, handleAddChildren } = useTreeCardContainer();

  return (
    <TreeCard
      nodeDatum={nodeDatum}
      hierarchyPointNode={hierarchyPointNode}
      toggleNode={toggleNode}
      onNodeClick={onNodeClick}
      onNodeMouseOver={onNodeMouseOver}
      onNodeMouseOut={onNodeMouseOut}
      onAddChildren={handleAddChildren}
      onDeleteChildren={handleDeleteChildren}
      onEditChildren={handleEditChildren}
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
}: TreeCustomNodeElementProps) => (
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
