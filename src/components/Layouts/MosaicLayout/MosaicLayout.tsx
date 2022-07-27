import { Grid, Stack } from "design-system";
import { Children, ReactElement } from "react";
import styles from "./MosaicLayout.module.scss";

interface GridLayoutProps {
  children: ReactElement<any, any>[];
}

const MosaicLayout = ({ children }: GridLayoutProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <Grid container padding={1} flexWrap="nowrap" height="100%" role="treegrid">
      <Grid item xs={9} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          {childrenArray[0]}
          {childrenArray[1]}
        </Stack>
      </Grid>
      <Grid item xs={3} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          {childrenArray[2]}
          {childrenArray[3]}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MosaicLayout;
