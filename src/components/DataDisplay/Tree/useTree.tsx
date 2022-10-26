import { useCallback, useContext, useState } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { setTree } from "@/features/Treege/reducer/treeReducer";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";

const useTree = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const { currentTree, setCurrentTree, dispatchTree } = useContext(TreegeContext);
  const { name, id } = currentTree;

  useWorkflowQuery(id, {
    enabled: !!id && !name,
    onSuccess: (response) => {
      setCurrentTree({ id: response?.id, name: response?.label });
      dispatchTree(setTree(response.workflow));
    },
  });

  const refContainer = useCallback((ref: null | Element) => {
    if (!ref) {
      return null;
    }

    const { width, height } = ref.getBoundingClientRect();

    setDimensions({ height, width });
    setTranslate({ x: width / 2, y: height / 2 });

    return ref;
  }, []);

  return { dimensions, refContainer, translate };
};

export default useTree;
