import TreeCard from "@/components/UI/TreeCard/TreeCard";
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
  const { handleDeleteChildren, handleEditChildren, handleAddChildren, handleOpenTreeModal } = useTreeCardContainer();

  return (
    <TreeCard
      nodeDatum={nodeDatum}
      hierarchyPointNode={hierarchyPointNode}
      toggleNode={toggleNode}
      onNodeClick={onNodeClick}
      onNodeMouseOver={onNodeMouseOver}
      onNodeMouseOut={onNodeMouseOut}
      onAddChildren={handleAddChildren}
      onOpenTreeModal={handleOpenTreeModal}
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
