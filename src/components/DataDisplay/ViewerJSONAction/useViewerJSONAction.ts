import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resetTree } from "@/features/Treege/reducer/treeReducer";
import useSnackbar from "@/hooks/useSnackbar";
import useTreegeContext from "@/hooks/useTreegeContext";
import usePatchWorkflowsMutation from "@/services/workflows/mutation/usePatchWorkflowsMutation";
import usePostWorkflowMutation from "@/services/workflows/mutation/usePostWorkflowMutation";

const useViewerJSONAction = () => {
  const { t } = useTranslation(["snackMessage"]);
  const { open } = useSnackbar();
  const { setCurrentTree, currentTree, tree, dispatchTree } = useTreegeContext();
  const [openModal, setOpenModal] = useState(false);
  const { version } = useTreegeContext();

  const { mutate: addWorkflowMutate } = usePostWorkflowMutation({
    onError: () => {
      open(t("error.saveTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: (data) => {
      open(t("success.saveTree", { ns: "snackMessage" }));
      setCurrentTree((prevState) => ({ ...prevState, id: data.workflow_id }));
    },
  });

  const { mutate: editWorkflowMutate } = usePatchWorkflowsMutation({
    onError: () => {
      open(t("error.updateTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: () => {
      open(t("success.updateTree", { ns: "snackMessage" }));
    },
  });

  const formatJSON = (value: any): string => JSON.stringify(value, null, 2);

  const getDownloadLink = (value: any) => `data:text/json;charset=utf-8,${encodeURIComponent(formatJSON(value))}`;

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleResetTree = () => {
    dispatchTree(resetTree());
    handleClose();
  };

  const handleSubmit = () => {
    const { name, id } = currentTree;

    if (!name) {
      setCurrentTree((prevState) => ({ ...prevState, errorName: "Champs Requis" }));
      return;
    }

    if (tree) {
      if (id) {
        editWorkflowMutate({ id, label: name, version, workflow: tree });
        return;
      }

      addWorkflowMutate({ label: name, version, workflow: tree });
    }
  };

  return { formatJSON, getDownloadLink, handleClose, handleOpen, handleResetTree, handleSubmit, openModal };
};

export default useViewerJSONAction;
