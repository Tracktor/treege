import { Box, Grid } from "@mui/material";
import { useContext } from "react";
import TreeForm from "@/components/ui/TreeForm/TreeForm";
import ViewerJSON from "@/components/ui/ViewerJSON/ViewerJSON";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import styles from "@/features/DecisionTreeGenerator/DecisionTreeGenerator.module.scss";
import TreeCardContainer from "@/features/DecisionTreeGenerator/TreeCardContainer/TreeCardContainer";

const DecisionTreeGeneratorConsumer = () => {
  const { tree } = useContext(DecisionTreeGeneratorContext);

  return (
    <Grid container p={1} className={styles.Grid}>
      <Grid item xs={9} padding={1}>
        <Box className={styles.Box}>
          <TreeForm data={tree} renderCustomNodeElement={TreeCardContainer} />
        </Box>
      </Grid>
      <Grid item xs={3} padding={1} className={styles.Grid}>
        <Box p={2} className={styles.Box}>
          <ViewerJSON value={tree} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DecisionTreeGeneratorConsumer;
