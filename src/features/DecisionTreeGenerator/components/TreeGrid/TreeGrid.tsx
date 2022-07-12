import { Box, Grid, Stack } from "@mui/material";
import { useContext } from "react";
import styles from "./TreeGrid.module.scss";
import MainModal from "@/components/ui/MainModal/MainModal";
import TreeForm from "@/components/ui/TreeForm/TreeForm";
import ViewerJSON from "@/components/ui/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/ui/ViewerJSONAction/ViewerJSONAction";
import TreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/TreeCardContainer";
import useTreeGrid from "@/features/DecisionTreeGenerator/components/TreeGrid/useTreeGrid";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import FormTreeCardDelete from "@/features/Forms/FormTreeCardDelete/FormTreeCardDelete";
import FormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/FormTreeCardMutation";

const TreeGrid = () => {
  const { tree, modalMutationIsOpen, modalDeleteIsOpen } = useContext(DecisionTreeGeneratorContext);
  const { getTitleModalMutation, closeModalMutation, closeModalDelete, getTitleModalDelete } = useTreeGrid();

  return (
    <Grid container padding={1} flexWrap="nowrap">
      <Grid item xs={9} padding={1} display="flex">
        <Box className={styles.Box}>
          <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} />
          <MainModal open={modalMutationIsOpen} onClose={closeModalMutation} title={getTitleModalMutation()}>
            <FormTreeCardMutation onClose={closeModalMutation} />
          </MainModal>
          <MainModal open={modalDeleteIsOpen} onClose={closeModalDelete} title={getTitleModalDelete()}>
            <FormTreeCardDelete onClose={closeModalDelete} />
          </MainModal>
        </Box>
      </Grid>
      <Grid item xs={3} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          <Box className={styles.BoxViewer}>
            <ViewerJSON value={tree} />
          </Box>
          <Box className={styles.BoxAction} p={2}>
            <ViewerJSONAction value={tree} />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TreeGrid;
