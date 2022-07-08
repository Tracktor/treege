import type { ReactNode } from "react";
import styles from "./MainLayout.module.scss";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <header />
    <main className={styles.Main}>{children}</main>
    <footer />
  </>
);

export default MainLayout;
