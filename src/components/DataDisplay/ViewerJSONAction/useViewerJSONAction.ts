import { useTranslation } from "react-i18next";
import useSnackbar from "@/hooks/useSnackbar";
import useTreegeContext from "@/hooks/useTreegeContext";
import useAddWorkflowsMutation from "@/services/workflows/mutation/useAddWorkflowsMutation";
import useEditWorkflowsMutation from "@/services/workflows/mutation/useEditWorkflowsMutation";

const useViewerJSONAction = () => {
  const { t } = useTranslation(["snackMessage"]);
  const { open } = useSnackbar();
  const { setCurrentTree, currentTree, tree } = useTreegeContext();

  const { mutate: addWorkflowMutate } = useAddWorkflowsMutation({
    onError: () => {
      open(t("error.saveTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: (data) => {
      open(t("success.saveTree", { ns: "snackMessage" }));
      setCurrentTree((prevState) => ({ ...prevState, id: data.workflow_id }));
    },
  });

  const { mutate: editWorkflowMutate } = useEditWorkflowsMutation({
    onError: () => {
      open(t("error.updateTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: () => {
      open(t("success.updateTree", { ns: "snackMessage" }));
    },
  });

  const formatJSON = (value: any): string => JSON.stringify(value, null, 2);

  const getDownloadLink = (value: any) => `data:text/json;charset=utf-8,${encodeURIComponent(formatJSON(value))}`;

  const handleSubmit = () => {
    const { name, id } = currentTree;

    if (!name) {
      setCurrentTree((prevState) => ({ ...prevState, errorName: "Champs Requis" }));
      return;
    }

    if (tree) {
      if (id) {
        editWorkflowMutate({ id, label: name, workflow: tree });
        return;
      }

      addWorkflowMutate({ label: name, workflow: tree });
    }
  };

  return { formatJSON, getDownloadLink, handleSubmit };
};

export default useViewerJSONAction;
