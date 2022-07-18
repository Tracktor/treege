import { Box, Modal } from "@mui/material";
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
  <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box className={styles.Box} p={4}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </Box>
  </Modal>
);

export default MainModal;
