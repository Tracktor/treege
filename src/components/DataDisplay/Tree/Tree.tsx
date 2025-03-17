import { Box, CircularProgress, GlobalStyles } from "@tracktor/design-system";
import type { TreeNode } from "@tracktor/types-treege";
import { memo, ReactElement } from "react";
import D3Tree, { RawNodeDatum, RenderCustomNodeElementFn } from "react-d3-tree";
import useTree from "@/components/DataDisplay/Tree/useTree";
import colors from "@/constants/colors";
import ButtonCreateTree from "@/features/Treege/components/Inputs/ButtonCreateTree/ButtonCreateTree";
import { TreeCustomNodeElementProps } from "@/features/Treege/components/TreeCardContainer/TreeCardContainer";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";

export type TreeRenderCustomNodeElementFn = (rd3tNodeProps: TreeCustomNodeElementProps) => ReactElement;

interface TreeProps {
  data: TreeNode | null;
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
  const { isLoading, data: workflow } = useWorkflowQuery(currentTree.id);

  if ((!data && !currentTree.id) || (workflow && !data)) {
    return <ButtonCreateTree />;
  }

  if ((currentTree.id && !data) || isLoading) {
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
        data={data as unknown as RawNodeDatum}
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
