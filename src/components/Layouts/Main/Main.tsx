import Box from "design-system/lib/components/Box";
import type { ReactNode } from "react";
import styles from "./Main.module.scss";

interface MainProps {
  children?: ReactNode;
}

const Main = ({ children }: MainProps) => (
  <Box className={styles.Box} component="main" role="tree">
    {children}
  </Box>
);

export default Main;
