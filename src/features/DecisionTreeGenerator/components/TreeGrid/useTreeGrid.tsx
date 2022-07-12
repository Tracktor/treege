import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeGrid = () => {
  const { currentHierarchyPointNode, setModalMutationIsOpen, setModalDeleteIsOpen } = useContext(DecisionTreeGeneratorContext);

  const getTitleModalMutation = () =>
    currentHierarchyPointNode?.data?.name ? `Ajouter un element à "${currentHierarchyPointNode?.data.name}"` : "";

  const getTitleModalDelete = () => `Voulez vraiment supprimer "${currentHierarchyPointNode?.data.name}"`;

  const closeModalMutation = () => {
    setModalMutationIsOpen(false);
  };

  const closeModalDelete = () => {
    setModalDeleteIsOpen(false);
  };

  return { closeModalDelete, closeModalMutation, getTitleModalDelete, getTitleModalMutation };
};

export default useTreeGrid;
