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
import ButtonCreateTree from "@/features/Treege/components/ButtonCreateTree/ButtonCreateTree";
import FormTreeCardDelete from "@/features/Treege/components/Forms/FormTreeCardDelete/FormTreeCardDelete";
import FormTreeCardMutation from "@/features/Treege/components/Forms/FormTreeCardMutation/FormTreeCardMutation";
import TreeCardContainer from "@/features/Treege/components/TreeCardContainer/TreeCardContainer";
import useTreeCardContainer from "@/features/Treege/components/TreeCardContainer/useTreeCardContainer";
import useTreeGrid from "@/features/Treege/components/TreeGrid/useTreeGrid";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { getTree } from "@/utils/tree";

const TreeGrid = () => {
  const { tree, treeModalOpen, treePath } = useContext(TreegeContext);
  const { handleCloseTreeModal } = useTreeCardContainer();
  const { getTitleModalMutation, closeModal, getTitleModalDelete, isModalMutationOpen, isDeleteModal } = useTreeGrid();
  const currentTreePath = treePath?.at(-1)?.path;
  const currentTreeName = treePath?.at(-1)?.label;
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

        <TreeModal open={treeModalOpen} onClose={handleCloseTreeModal} title={currentTreeName}>
          {currentTree && <TreeForm data={currentTree} renderCustomNodeElement={TreeCardContainer} />}
        </TreeModal>
      </Main>

      <Sidebar>
        <ViewerJSON value={tree} />
      </Sidebar>

      <Action>
        <ViewerJSONAction value={tree} />
      </Action>
    </MosaicLayout>
  );
};

export default TreeGrid;
