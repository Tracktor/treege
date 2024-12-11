import { Stack } from "@tracktor/design-system";
import Logo from "@/components/DataDisplay/Logo/Logo";
import TreeViewer from "@/components/DataDisplay/TreeViewer/TreeViewer";
import ViewerJSON from "@/components/DataDisplay/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/DataDisplay/ViewerJSONAction/ViewerJSONAction";
import MainModal from "@/components/FeedBack/MainModal/MainModal";
import TreeModal from "@/components/FeedBack/TreeModal/TreeModal";
import Action from "@/components/Layouts/Action/Action";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
import FormTreeCardDelete from "@/features/Treege/components/Forms/FormTreeCardDelete/FormTreeCardDelete";
import FormTreeCardMutation from "@/features/Treege/components/Forms/FormTreeCardMutation/FormTreeCardMutation";
import useTreeCardContainer from "@/features/Treege/components/TreeCardContainer/useTreeCardContainer";
import useTreeGrid from "@/features/Treege/components/TreeGrid/useTreeGrid";
import TreeNameTextField from "@/features/Treege/components/TreeNameTextField";
import TreeSelect from "@/features/Treege/components/TreeSelect";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import { getTree } from "@/utils/tree";

const TreeGrid = () => {
  const { tree, treeModalOpen, treePath, backendConfig, currentTree } = useTreegeContext();
  const { handleCloseTreeModal } = useTreeCardContainer();
  const { getTitleModalMutation, closeModal, getTitleModalDelete, isModalMutationOpen, isDeleteModal, handleChangeTree } = useTreeGrid();
  const { data: workflow, isFetching: isPendingWorkflow } = useWorkflowQuery(currentTree.id);
  const lastTreePath = treePath?.at(-1);
  const currentTreePath = lastTreePath?.path;
  const currentTreeName = lastTreePath?.label;
  const openTree = getTree(tree, currentTreePath);
  const isLoading = isPendingWorkflow || (workflow && !tree);

  return (
    <>
      <MosaicLayout>
        <Header>
          <Stack justifyContent="space-between" direction="row" alignItems="center">
            <Logo />
            {!!backendConfig?.baseUrl && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <TreeNameTextField />
                <TreeSelect size="small" arrowOnly showBtnAddNewTree fetchWorkflowsOnOpen />
              </Stack>
            )}
          </Stack>
        </Header>

        <Main>
          <TreeViewer data={tree} isLoading={isLoading} />
        </Main>

        <Sidebar>
          <ViewerJSON value={tree} onChange={handleChangeTree} />
        </Sidebar>

        <Action>
          <ViewerJSONAction value={tree} />
        </Action>
      </MosaicLayout>

      {/* Modal tree node mutation */}
      <MainModal open={isModalMutationOpen} onClose={closeModal} title={getTitleModalMutation()}>
        <FormTreeCardMutation onClose={closeModal} />
      </MainModal>

      {/* Modal confirm delete tree node */}
      <MainModal open={isDeleteModal} onClose={closeModal} title={getTitleModalDelete()}>
        <FormTreeCardDelete onClose={closeModal} />
      </MainModal>

      {/* Tree modal viewer */}
      <TreeModal open={treeModalOpen} onClose={handleCloseTreeModal} title={currentTreeName}>
        <TreeViewer data={openTree} />
      </TreeModal>
    </>
  );
};

export default TreeGrid;
