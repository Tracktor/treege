import { Box, Grid, Stack } from "@mui/material";
import { useContext } from "react";
import styles from "./TreeGrid.module.scss";
import TreeForm from "@/components/ui/TreeForm/TreeForm";
import TreeModal from "@/components/ui/TreeModal/TreeModal";
import ViewerJSON from "@/components/ui/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/ui/ViewerJSONAction/ViewerJSONAction";
import TreeCardContainer from "@/features/DecisionTreeGenerator/components/TreeCardContainer/TreeCardContainer";
import useTreeGrid from "@/features/DecisionTreeGenerator/components/TreeGrid/useTreeGrid";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const TreeGrid = () => {
  const { tree, setModalIsOpen, modalIsOpen } = useContext(DecisionTreeGeneratorContext);
  const { getModalSuffix } = useTreeGrid();

  return (
    <Grid container padding={1} flexWrap="nowrap">
      <Grid item xs={9} padding={1} display="flex">
        <Box className={styles.Box}>
          <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} />
          <TreeModal open={modalIsOpen} onClose={() => setModalIsOpen(false)} suffixTitle={getModalSuffix()} />
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
