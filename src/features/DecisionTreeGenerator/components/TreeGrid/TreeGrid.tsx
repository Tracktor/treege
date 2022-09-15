import { useContext } from "react";
import Action from "@/components/Layouts/Action/Action";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
import Logo from "@/components/UI/Logo/Logo";
import MainModal from "@/components/UI/MainModal/MainModal";
import TreeForm from "@/components/UI/TreeForm/TreeForm";
import ViewerJSON from "@/components/UI/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/UI/ViewerJSONAction/ViewerJSONAction";
import ButtonCreateTree from "@/features/DecisionTreeGenerator/components/ButtonCreateTree/ButtonCreateTree";
import TreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/TreeCardContainer";
import useTreeGrid from "@/features/DecisionTreeGenerator/components/TreeGrid/useTreeGrid";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import FormTreeCardDelete from "@/features/DecisionTreeGenerator/Forms/FormTreeCardDelete/FormTreeCardDelete";
import FormTreeCardMutation from "@/features/DecisionTreeGenerator/Forms/FormTreeCardMutation/FormTreeCardMutation";

const TreeGrid = () => {
  const { tree, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const { getTitleModalMutation, closeModal, getTitleModalDelete, handleOnSave, isModalMutationOpen } = useTreeGrid();

  return (
    <MosaicLayout>
      <Header>
        <Logo />
      </Header>

      <Main>
        {tree ? <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} /> : <ButtonCreateTree />}
        <MainModal open={isModalMutationOpen} onClose={closeModal} title={getTitleModalMutation()}>
          <FormTreeCardMutation onClose={closeModal} />
        </MainModal>
        <MainModal open={modalOpen === "delete"} onClose={closeModal} title={getTitleModalDelete()}>
          <FormTreeCardDelete onClose={closeModal} />
        </MainModal>
      </Main>

      <Sidebar>
        <ViewerJSON value={tree} />
      </Sidebar>

      <Action>
        <ViewerJSONAction value={tree} onSave={handleOnSave} />
      </Action>
    </MosaicLayout>
  );
};

export default TreeGrid;
