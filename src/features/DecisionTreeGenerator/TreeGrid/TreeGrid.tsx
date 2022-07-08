import { Box, Grid, Stack } from "@mui/material";
import { useContext } from "react";
import styles from "./TreeGrid.module.scss";
import TreeForm from "@/components/ui/TreeForm/TreeForm";
import ViewerJSON from "@/components/ui/ViewerJSON/ViewerJSON";
import ViewerJSONAction from "@/components/ui/ViewerJSONAction/ViewerJSONAction";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import TreeCardContainer from "@/features/DecisionTreeGenerator/TreeCardContainer/TreeCardContainer";

const TreeGrid = () => {
  const { tree } = useContext(DecisionTreeGeneratorContext);

  return (
    <Grid container p={1} className={styles.Grid}>
      <Grid item xs={9} padding={1} className={styles.Grid}>
        <Box className={styles.Box}>
          <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} />
        </Box>
      </Grid>
      <Grid item xs={3} padding={1} className={styles.GridItemViewer}>
        <Stack spacing={1} className={styles.Stack}>
          <Box p={2} className={`${styles.Box} ${styles.BoxViewer}`}>
            <ViewerJSON value={tree} />
          </Box>
          <Box p={2} className={`${styles.Box} ${styles.BoxAction}`}>
            <ViewerJSONAction value={tree} />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TreeGrid;
