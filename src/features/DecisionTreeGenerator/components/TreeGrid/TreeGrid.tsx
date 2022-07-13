import { Box, Grid, Stack } from "@mui/material";
import { useContext } from "react";
import styles from "./TreeGrid.module.scss";
import Logo from "@/assets/img/treege-white.svg";
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
  const { tree, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const { getTitleModalMutation, closeModal, getTitleModalDelete, isModalMutationOpen } = useTreeGrid();

  return (
    <Grid container padding={1} flexWrap="nowrap">
      <Grid item xs={9} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          <Box className={styles.BoxSmall} padding={2}>
            <img src={Logo} alt="Treege" height={30} width="auto" />
          </Box>
          <Box className={styles.Box}>
            <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} />
            <MainModal open={isModalMutationOpen} onClose={closeModal} title={getTitleModalMutation()}>
              <FormTreeCardMutation onClose={closeModal} />
            </MainModal>
            <MainModal open={modalOpen === "delete"} onClose={closeModal} title={getTitleModalDelete()}>
              <FormTreeCardDelete onClose={closeModal} />
            </MainModal>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={3} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          <Box className={styles.BoxViewer}>
            <ViewerJSON value={tree} />
          </Box>
          <Box className={styles.BoxSmall} p={2}>
            <ViewerJSONAction value={tree} />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TreeGrid;
