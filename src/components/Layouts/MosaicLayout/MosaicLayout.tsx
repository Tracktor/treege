import { Grid, Stack } from "@tracktor/design-system";
import { Children, ReactElement } from "react";

interface GridLayoutProps {
  children: ReactElement<any, any>[];
}

const styles = {
  stack: {
    width: "100%",
  },
};

const MosaicLayout = ({ children }: GridLayoutProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <Grid container padding={1} flexWrap="nowrap" height="100%" role="treegrid">
      <Grid size={{ xs: 9 }} padding={1} display="flex">
        <Stack sx={styles.stack} spacing={2}>
          {childrenArray[0]}
          {childrenArray[1]}
        </Stack>
      </Grid>
      <Grid size={{ xs: 3 }} padding={1} display="flex">
        <Stack sx={styles.stack} spacing={2}>
          {childrenArray[2]}
          {childrenArray[3]}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MosaicLayout;
