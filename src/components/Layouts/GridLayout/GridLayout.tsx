import { Box, Grid, Stack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import styles from "./GridLayout.module.scss";

interface GridLayoutProps {
  children?: ReactElement<any, any>[];
}

interface ChildProps {
  children?: ReactNode;
}

const Header = ({ children }: ChildProps) => (
  <Box className={styles.BoxSmall} padding={2}>
    {children}
  </Box>
);

const Main = ({ children }: ChildProps) => <Box className={styles.Box}>{children}</Box>;

const SideBar = ({ children }: ChildProps) => <Box className={styles.BoxSideBar}>{children}</Box>;

const Action = ({ children }: ChildProps) => (
  <Box className={styles.BoxSmall} p={2}>
    {children}
  </Box>
);

const GridLayout = ({ children }: GridLayoutProps) => {
  const HeaderChildren = children?.find(({ type }) => type?.name === "Header");
  const MainChildren = children?.find(({ type }) => type?.name === "Main");
  const SideBarChildren = children?.find(({ type }) => type?.name === "SideBar");
  const ActionChildren = children?.find(({ type }) => type?.name === "Action");

  return (
    <Grid container padding={1} flexWrap="nowrap" height="100%">
      <Grid item xs={9} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          {HeaderChildren}
          {MainChildren}
        </Stack>
      </Grid>
      <Grid item xs={3} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          {SideBarChildren}
          {ActionChildren}
        </Stack>
      </Grid>
    </Grid>
  );
};

GridLayout.Header = Header;
GridLayout.Main = Main;
GridLayout.SideBar = SideBar;
GridLayout.Action = Action;

export default GridLayout;
