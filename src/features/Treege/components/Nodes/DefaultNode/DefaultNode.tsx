import { NodeProps } from "@xyflow/react";
import { AppNode } from "@/components/DataDisplay/Nodes";
import DefaultNodeComponent from "@/components/DataDisplay/Nodes/DefaultNode";
import useTreegeContext from "@/hooks/useTreegeContext";

const DefaultNode = (props: NodeProps<AppNode>) => {
  const { setModalOpen, setCurrentHierarchyPointNode, setTreeModalOpen, setTreePath } = useTreegeContext();

  const handleAddChildren = (nodeProps: NodeProps<AppNode>) => {
    console.log("handleAddChildren", nodeProps);
    setCurrentHierarchyPointNode(nodeProps);
    setModalOpen("add");
  };

  const handleDeleteChildren = (nodeProps: NodeProps<AppNode>) => {
    setCurrentHierarchyPointNode(nodeProps);
    setModalOpen("delete");
  };

  const handleEditChildren = (nodeProps: NodeProps<AppNode>) => {
    setCurrentHierarchyPointNode(nodeProps);
    setModalOpen("edit");
  };

  const handleOpenTreeModal = (nodeProps: NodeProps<AppNode>) => {
    const currentTree = {
      label: nodeProps?.data.label || "",
      path: nodeProps?.data?.treePath || "",
    };

    setTreePath((prevState) => [...prevState, currentTree]);
    setTreeModalOpen(true);
  };

  return (
    <DefaultNodeComponent
      onAddChildren={handleAddChildren}
      onDeleteChildren={handleDeleteChildren}
      onEditChildren={handleEditChildren}
      onOpenTreeModal={handleOpenTreeModal}
      {...props}
    />
  );
};

export default DefaultNode;
