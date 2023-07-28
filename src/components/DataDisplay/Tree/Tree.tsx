import { Box, CircularProgress, GlobalStyles } from "@tracktor/design-system";
import { memo } from "react";
import D3Tree from "react-d3-tree";
import type { RenderCustomNodeElementFn } from "react-d3-tree/lib/types/types/common";
import useTree from "@/components/DataDisplay/Tree/useTree";
import colors from "@/constants/colors";
import ButtonCreateTree from "@/features/Treege/components/ButtonCreateTree/ButtonCreateTree";
import type { TreeRenderCustomNodeElementFn } from "@/features/Treege/type/TreeNode";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";

interface TreeProps {
  data: any;
  renderCustomNodeElement?: TreeRenderCustomNodeElementFn;
  nodeSize?: {
    x: number;
    y: number;
  };
}

const styles = {
  container: {
    height: "100%",
    width: "100%",
  },
  progressContainer: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
  },
  treeLink: {
    stroke: `${colors.borderGrey} !important`,
  },
};

const pathClass = "tree-link";

const Tree = ({
  data,
  renderCustomNodeElement,
  nodeSize = {
    x: 300,
    y: 300,
  },
}: TreeProps) => {
  const { dimensions, refContainer, translate } = useTree();
  const { currentTree } = useTreegeContext();
  const { isInitialLoading } = useWorkflowQuery(currentTree.id);

  if (!data && !currentTree.id) {
    return <ButtonCreateTree />;
  }

  if ((currentTree.id && !data) || isInitialLoading) {
    return (
      <Box sx={styles.progressContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={styles.container} ref={refContainer}>
      <GlobalStyles styles={{ [`.${pathClass}`]: styles.treeLink }} />
      <D3Tree
        data={data}
        orientation="vertical"
        translate={translate}
        dimensions={dimensions}
        renderCustomNodeElement={renderCustomNodeElement as unknown as RenderCustomNodeElementFn}
        pathFunc="diagonal"
        pathClassFunc={() => pathClass}
        nodeSize={nodeSize}
      />
    </div>
  );
};

export default memo(Tree);
