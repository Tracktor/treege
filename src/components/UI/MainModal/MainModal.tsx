import { Box, Dialog } from "design-system-tracktor";
import type { ReactNode } from "react";
import styles from "./MainModal.module.scss";

interface TreeModalProps {
  children?: ReactNode;
  description?: string;
  title?: string;
  open: boolean;
  onClose?(): void;
}

const MainModal = ({ children, description, open, onClose, title }: TreeModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    scroll="body"
    maxWidth="sm"
    fullWidth
  >
    <Box className={styles.Box} p={4}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </Box>
  </Dialog>
);

export default MainModal;
