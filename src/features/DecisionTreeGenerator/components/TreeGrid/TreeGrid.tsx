import { useContext } from "react";
import Action from "@/components/Layouts/Action/Action";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
import Logo from "@/components/UI/Logo/Logo";
import MainModal from "@/components/UI/MainModal/MainModal";
import TreeForm from "@/components/UI/TreeForm/TreeForm";
import TreeModal from "@/components/UI/TreeModal/TreeModal";
import ViewerJSON from "@/components/UI/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/UI/ViewerJSONAction/ViewerJSONAction";
import ButtonCreateTree from "@/features/DecisionTreeGenerator/components/ButtonCreateTree/ButtonCreateTree";
import FormTreeCardDelete from "@/features/DecisionTreeGenerator/components/Forms/FormTreeCardDelete/FormTreeCardDelete";
import FormTreeCardMutation from "@/features/DecisionTreeGenerator/components/Forms/FormTreeCardMutation/FormTreeCardMutation";
import TreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/TreeCardContainer";
import useTreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/useTreeCardContainer";
import useTreeGrid from "@/features/DecisionTreeGenerator/components/TreeGrid/useTreeGrid";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import getTree from "@/utils/tree/getTree/getTree";

const TreeGrid = () => {
  const { tree, treeModalOpen, treePath } = useContext(DecisionTreeGeneratorContext);
  const { handleCloseTreeModal } = useTreeCardContainer();
  const { getTitleModalMutation, closeModal, getTitleModalDelete, handleOnSave, isModalMutationOpen, isDeleteModal } = useTreeGrid();
  const currentTreePath = treePath?.at(-1)?.path;
  const currentTree = tree && getTree(tree, currentTreePath);

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
        <MainModal open={isDeleteModal} onClose={closeModal} title={getTitleModalDelete()}>
          <FormTreeCardDelete onClose={closeModal} />
        </MainModal>

        <TreeModal open={treeModalOpen} onClose={handleCloseTreeModal} title={currentTree?.attributes.label}>
          {currentTree && <TreeForm data={currentTree} renderCustomNodeElement={TreeCardContainer} />}
        </TreeModal>
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
