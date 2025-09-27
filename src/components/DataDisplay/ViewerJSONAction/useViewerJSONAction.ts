import { useSnackbar } from "@tracktor/design-system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resetTree } from "@/features/TreegeTree/reducer/treeReducer";
import useTreegeContext from "@/hooks/useTreegeContext";
import usePatchWorkflowsMutation from "@/services/workflows/mutation/usePatchWorkflowsMutation";
import usePostWorkflowMutation from "@/services/workflows/mutation/usePostWorkflowMutation";

const useViewerJSONAction = () => {
  const { t } = useTranslation(["snackMessage"]);
  const { openSnackbar } = useSnackbar();
  const { setCurrentTree, currentTree, tree, dispatchTree } = useTreegeContext();
  const [openModal, setOpenModal] = useState(false);
  const { version } = useTreegeContext();
  const { mutate: addWorkflowMutate } = usePostWorkflowMutation();
  const { mutate: editWorkflowMutate } = usePatchWorkflowsMutation();

  const formatJSON = (value: any): string => JSON.stringify(value, null, 2);

  const getDownloadLink = (value: any) => `data:text/json;charset=utf-8,${encodeURIComponent(formatJSON(value))}`;

  const copyToClipboard = (value: unknown) => () => {
    navigator.clipboard.writeText(formatJSON(value)).then();
    openSnackbar({ message: t("success.copyToClipboard", { ns: "snackMessage" }) });
  };

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
        editWorkflowMutate(
          { id, label: name, version, workflow: tree },
          {
            onError: () => {
              openSnackbar({
                message: t("error.updateTree", { ns: "snackMessage" }),
                severity: "error",
              });
            },
            onSuccess: () => {
              openSnackbar({ message: t("success.updateTree", { ns: "snackMessage" }) });
            },
          },
        );
        return;
      }

      addWorkflowMutate(
        { label: name, version, workflow: tree },
        {
          onError: () => {
            openSnackbar({
              message: t("error.updateTree", { ns: "snackMessage" }),
              severity: "error",
            });
          },
          onSuccess: () => {
            openSnackbar({ message: t("success.updateTree", { ns: "snackMessage" }) });
          },
        },
      );
    }
  };

  return {
    copyToClipboard,
    formatJSON,
    getDownloadLink,
    handleClose,
    handleOpen,
    handleResetTree,
    handleSubmit,
    openModal,
  };
};

export default useViewerJSONAction;
