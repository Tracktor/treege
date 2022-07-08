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
    <Grid container padding={1} flexWrap="nowrap">
      <Grid item xs={9} padding={1} display="flex">
        <Box className={styles.Box}>
          <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} />
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
