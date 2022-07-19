import { Box } from "@mui/material";
import type { ReactNode } from "react";
import styles from "./Main.module.scss";

interface MainProps {
  children?: ReactNode;
}

const Main = ({ children }: MainProps) => <Box className={styles.Box}>{children}</Box>;

export default Main;
