import Box from "design-system/lib/components/Box";
import type { ReactNode } from "react";
import styles from "./Action.module.scss";

interface ActionProps {
  children?: ReactNode;
}

const Action = ({ children }: ActionProps) => (
  <Box className={styles.Box} p={2} role="group">
    {children}
  </Box>
);

export default Action;
