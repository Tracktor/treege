import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeGrid = () => {
  const { currentHierarchyPointNode, modalOpen, setModalOpen } = useContext(DecisionTreeGeneratorContext);
  const isModalMutationOpen = modalOpen === "edit" || modalOpen === "add";

  const getTitleModalMutation = () =>
    currentHierarchyPointNode?.data?.name ? `Ajouter un element à "${currentHierarchyPointNode?.data.name}"` : "";

  const getTitleModalDelete = () => `Voulez vraiment supprimer "${currentHierarchyPointNode?.data.name}"`;

  const closeModal = () => {
    setModalOpen(null);
  };

  return { closeModal, getTitleModalDelete, getTitleModalMutation, isModalMutationOpen };
};

export default useTreeGrid;
