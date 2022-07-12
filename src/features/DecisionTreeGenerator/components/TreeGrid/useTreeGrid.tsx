import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeGrid = () => {
  const { currentHierarchyPointNode, modalOpen, setModalOpen } = useContext(DecisionTreeGeneratorContext);
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isModalMutationOpen = isEditModal || isAddModal;

  const getTitleModalMutation = () => {
    const AddTitle = `Ajouter un champ à « ${currentHierarchyPointNode?.data.name} »"`;
    const EditTitle = `Editer le champ « ${currentHierarchyPointNode?.data.name} »"`;

    return isEditModal ? EditTitle : AddTitle;
  };

  const getTitleModalDelete = () => `Voulez vraiment supprimer "${currentHierarchyPointNode?.data.name}"`;

  const closeModal = () => {
    setModalOpen(null);
  };

  return { closeModal, getTitleModalDelete, getTitleModalMutation, isModalMutationOpen };
};

export default useTreeGrid;
