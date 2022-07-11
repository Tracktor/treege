import { Box, Modal } from "@mui/material";
import styles from "./TreeModal.module.scss";
import FormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/FormTreeCardMutation";

interface TreeModalProps {
  suffixTitle?: string;
  open: boolean;
  onClose?(): void;
}

const TreeModal = ({ open, onClose, suffixTitle }: TreeModalProps) => (
  <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box className={styles.Box} p={4}>
      <h2>Ajouter un element {suffixTitle}</h2>
      <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
      <FormTreeCardMutation onClose={onClose} />
    </Box>
  </Modal>
);

export default TreeModal;
