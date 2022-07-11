import { Box, Modal } from "@mui/material";
import styles from "./TreeModal.module.scss";

interface TreeModalProps {
  open: boolean;
  onClose(): void;
}

const TreeModal = ({ open, onClose }: TreeModalProps) => (
  <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box className={styles.Box} p={4}>
      <h2>Ajouter un enfant</h2>
      <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    </Box>
  </Modal>
);

export default TreeModal;
