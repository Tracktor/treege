import { Box } from "@mui/material";
import type { ReactNode } from "react";
import styles from "./Header.module.scss";

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => (
  <Box className={styles.Box} padding={2}>
    {children}
  </Box>
);

export default Header;
