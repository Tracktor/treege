import { NodeProps } from "@xyflow/react";
import { AppNode } from "@/components/DataDisplay/Nodes";
import DefaultNodeComponent from "@/components/DataDisplay/Nodes/DefaultNode";
import useTreegeContext from "@/hooks/useTreegeContext";

const DefaultNode = ({ data, type }: NodeProps<AppNode>) => {
  const { setModalOpen, setCurrentHierarchyPointNode, setTreeModalOpen, setTreePath } = useTreegeContext();

  const handleAddChildren = (hierarchyPointNode: any) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("add");
  };

  const handleDeleteChildren = (hierarchyPointNode: any) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("delete");
  };

  const handleEditChildren = (hierarchyPointNode: any) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("edit");
  };

  const handleOpenTreeModal = (hierarchyPointNode: any) => {
    const currentTree = {
      label: hierarchyPointNode?.data.attributes?.label || "",
      path: hierarchyPointNode?.data?.attributes?.treePath || "",
    };

    setTreePath((prevState) => [...prevState, currentTree]);
    setTreeModalOpen(true);
  };

  return (
    <DefaultNodeComponent
      data={data}
      nodeType={type}
      onDeleteChildren={handleDeleteChildren}
      onEditChildren={handleEditChildren}
      onAddChildren={handleAddChildren}
      onOpenTreeModal={handleOpenTreeModal}
    />
  );
};

export default DefaultNode;
