import { useContext } from "react";
import GridLayout from "@/components/Layouts/GridLayout/GridLayout";
import Logo from "@/components/UI/Logo/Logo";
import MainModal from "@/components/UI/MainModal/MainModal";
import TreeForm from "@/components/UI/TreeForm/TreeForm";
import ViewerJSON from "@/components/UI/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/UI/ViewerJSONAction/ViewerJSONAction";
import ButtonCreateTree from "@/features/DecisionTreeGenerator/components/ButtonCreateTree/ButtonCreateTree";
import TreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/TreeCardContainer";
import useTreeGrid from "@/features/DecisionTreeGenerator/components/TreeGrid/useTreeGrid";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import FormTreeCardDelete from "@/features/Forms/FormTreeCardDelete/FormTreeCardDelete";
import FormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/FormTreeCardMutation";

const TreeGrid = () => {
  const { tree, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const { getTitleModalMutation, closeModal, getTitleModalDelete, handleOnSave, isModalMutationOpen } = useTreeGrid();

  return (
    <GridLayout>
      <GridLayout.Header>
        <Logo />
      </GridLayout.Header>

      <GridLayout.Main>
        {tree ? <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} /> : <ButtonCreateTree />}
        <MainModal open={isModalMutationOpen} onClose={closeModal} title={getTitleModalMutation()}>
          <FormTreeCardMutation onClose={closeModal} />
        </MainModal>
        <MainModal open={modalOpen === "delete"} onClose={closeModal} title={getTitleModalDelete()}>
          <FormTreeCardDelete onClose={closeModal} />
        </MainModal>
      </GridLayout.Main>

      <GridLayout.SideBar>
        <ViewerJSON value={tree} />
      </GridLayout.SideBar>

      <GridLayout.Action>
        <ViewerJSONAction value={tree} onSave={handleOnSave} />
      </GridLayout.Action>
    </GridLayout>
  );
};

export default TreeGrid;
