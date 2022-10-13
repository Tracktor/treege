import { GlobalStyles } from "design-system-tracktor";
import { memo } from "react";
import Tree from "react-d3-tree";
import type { RenderCustomNodeElementFn } from "react-d3-tree/lib/types/common";
import useTreeForm from "@/components/UI/TreeForm/useTreeForm";
import colors from "@/constants/colors";
import type { TreeRenderCustomNodeElementFn } from "@/features/Treege/type/TreeNode";

interface TreeFormProps {
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

const TreeForm = ({
  data,
  renderCustomNodeElement,
  nodeSize = {
    x: 300,
    y: 300,
  },
}: TreeFormProps) => {
  const { dimensions, refContainer, translate } = useTreeForm();

  if (!data) {
    return null;
  }

  return (
    <div style={styles.container} ref={refContainer}>
      <GlobalStyles styles={{ [`.${pathClass}`]: styles.treeLink }} />
      <Tree
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

export default memo(TreeForm);
