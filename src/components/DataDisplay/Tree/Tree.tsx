import { GlobalStyles } from "design-system-tracktor";
import { memo } from "react";
import D3Tree from "react-d3-tree";
import type { RenderCustomNodeElementFn } from "react-d3-tree/lib/types/common";
import useTree from "@/components/DataDisplay/Tree/useTree";
import colors from "@/constants/colors";
import type { TreeRenderCustomNodeElementFn } from "@/features/Treege/type/TreeNode";

interface TreeProps {
  data: any;
  nodeSize?: { x: number; y: number };
  renderCustomNodeElement?: TreeRenderCustomNodeElementFn;
}

const styles = {
  container: {
    height: "100%",
    width: "100%",
  },
  treeLink: {
    stroke: `${colors.borderMedium} !important`,
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

  if (!data) {
    return null;
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
