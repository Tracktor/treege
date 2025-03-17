import type { TreeNode } from "@tracktor/types-treege";
import type { HierarchyPointNode } from "d3-hierarchy";
import { CustomNodeElementProps } from "react-d3-tree/lib/types/types/common";
import TreeCard from "@/components/DataDisplay/TreeCard/TreeCard";
import useTreeCardContainer from "@/features/Treege/components/TreeCardContainer/useTreeCardContainer";

export interface TreeCustomNodeElementProps extends Omit<CustomNodeElementProps, "hierarchyPointNode"> {
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

const TreeCardContainerConsumer = ({
  nodeDatum,
  hierarchyPointNode,
  toggleNode,
  onNodeClick,
  onNodeMouseOver,
  onNodeMouseOut,
  addChildren,
}: TreeCustomNodeElementProps) => {
  const { handleDeleteChildren, handleEditChildren, handleAddChildren, handleOpenTreeModal } = useTreeCardContainer();

  return (
    <TreeCard
      addChildren={addChildren}
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
  addChildren,
}: TreeCustomNodeElementProps) => (
  <TreeCardContainerConsumer
    addChildren={addChildren}
    nodeDatum={nodeDatum}
    hierarchyPointNode={hierarchyPointNode}
    toggleNode={toggleNode}
    onNodeClick={onNodeClick}
    onNodeMouseOver={onNodeMouseOver}
    onNodeMouseOut={onNodeMouseOut}
  />
);

export default TreeCardContainer;
