import { NodeProps, useReactFlow } from "@xyflow/react";
import { AppNode } from "@/components/DataDisplay/Nodes";
import DefaultNodeComponent from "@/components/DataDisplay/Nodes/DefaultNode";
import useTreegeContext from "@/hooks/useTreegeContext";
import transformToHierarchyNode from "@/utils/tree/transformToHierarchyNode/transformToHierarchyNode";

const DefaultNode = (props: NodeProps<AppNode>) => {
  const { setModalOpen, setCurrentHierarchyPointNode, setTreeModalOpen, setTreePath } = useTreegeContext();
  const reactFlow = useReactFlow<AppNode>();

  const handleNodeOperation = (type: "edit" | "delete" | "add") => (nodeProps: NodeProps<AppNode>) => {
    const nodes = reactFlow.getNodes();
    const edges = reactFlow.getEdges();

    const hierarchyNode = transformToHierarchyNode(nodeProps, nodes, edges);
    setCurrentHierarchyPointNode(hierarchyNode);
    setModalOpen(type);
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      onAddChildren={handleNodeOperation("add")}
      onDeleteChildren={handleNodeOperation("delete")}
      onEditChildren={handleNodeOperation("edit")}
      onOpenTreeModal={handleOpenTreeModal}
    />
  );
};

export default DefaultNode;
