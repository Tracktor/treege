import { Box } from "@mui/material";
import type { ReactNode } from "react";
import styles from "./Action.module.scss";

interface ActionProps {
  children?: ReactNode;
}

const Action = ({ children }: ActionProps) => (
  <Box className={styles.BoxSmall} p={2}>
    {children}
  </Box>
);

export default Action;
