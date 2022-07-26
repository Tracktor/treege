import Grid from "design-system/lib/components/Grid";
import Stack from "design-system/lib/components/Stack";
import { Children, ReactElement } from "react";
import styles from "./MosaicLayout.module.scss";

interface GridLayoutProps {
  children: ReactElement<any, any>[];
}

const MosaicLayout = ({ children }: GridLayoutProps) => {
  const allowedChildren = ["Header", "Main", "Sidebar", "Action"];
  const childrenName = Children.map(children, (child) => child?.type?.name);
  const HeaderChildren = children?.find(({ type }) => type?.name === "Header");
  const MainChildren = children?.find(({ type }) => type?.name === "Main");
  const SidebarChildren = children?.find(({ type }) => type?.name === "Sidebar");
  const ActionChildren = children?.find(({ type }) => type?.name === "Action");
  const hasWrongChildren = !childrenName?.every((name) => allowedChildren.includes(name));

  if (hasWrongChildren) {
    throw Error(`Only component "${allowedChildren.join(" ")}" is allowed as children`);
  }

  return (
    <Grid container padding={1} flexWrap="nowrap" height="100%" role="treegrid">
      <Grid item xs={9} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          {HeaderChildren}
          {MainChildren}
        </Stack>
      </Grid>
      <Grid item xs={3} padding={1} display="flex">
        <Stack className={styles.Stack} spacing={2}>
          {SidebarChildren}
          {ActionChildren}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MosaicLayout;
