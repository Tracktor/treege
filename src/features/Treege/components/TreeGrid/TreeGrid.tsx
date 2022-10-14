import { useContext } from "react";
import Logo from "@/components/DataDisplay/Logo/Logo";
import Tree from "@/components/DataDisplay/Tree/Tree";
import ViewerJSON from "@/components/DataDisplay/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/DataDisplay/ViewerJSONAction/ViewerJSONAction";
import MainModal from "@/components/FeedBack/MainModal/MainModal";
import TreeModal from "@/components/FeedBack/TreeModal/TreeModal";
import Action from "@/components/Layouts/Action/Action";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
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
    <>
      <MosaicLayout>
        <Header>
          <Logo />
        </Header>

        <Main>{tree ? <Tree data={tree} renderCustomNodeElement={TreeCardContainer} /> : <ButtonCreateTree />}</Main>

        <Sidebar>
          <ViewerJSON value={tree} />
        </Sidebar>

        <Action>
          <ViewerJSONAction value={tree} />
        </Action>
      </MosaicLayout>

      <MainModal open={isModalMutationOpen} onClose={closeModal} title={getTitleModalMutation()}>
        <FormTreeCardMutation onClose={closeModal} />
      </MainModal>

      <MainModal open={isDeleteModal} onClose={closeModal} title={getTitleModalDelete()}>
        <FormTreeCardDelete onClose={closeModal} />
      </MainModal>

      <TreeModal open={treeModalOpen} onClose={handleCloseTreeModal} title={currentTreeName}>
        {currentTree && <Tree data={currentTree} renderCustomNodeElement={TreeCardContainer} />}
      </TreeModal>
    </>
  );
};

export default TreeGrid;
