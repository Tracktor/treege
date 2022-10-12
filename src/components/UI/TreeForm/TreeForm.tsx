import { memo } from "react";
import Tree from "react-d3-tree";
import type { RenderCustomNodeElementFn } from "react-d3-tree/lib/types/common";
import styles from "./TreeForm.module.scss";
import useTreeForm from "@/components/UI/TreeForm/useTreeForm";
import type { TreeRenderCustomNodeElementFn } from "@/features/Treege/type/TreeNode";

interface TreeFormProps {
  data: any;
  nodeSize?: { x: number; y: number };
  renderCustomNodeElement?: TreeRenderCustomNodeElementFn;
}

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
    <div className={styles.Container} ref={refContainer}>
      <Tree
        data={data}
        orientation="vertical"
        translate={translate}
        dimensions={dimensions}
        renderCustomNodeElement={renderCustomNodeElement as unknown as RenderCustomNodeElementFn}
        pathFunc="diagonal"
        pathClassFunc={() => styles.Link}
        nodeSize={nodeSize}
      />
    </div>
  );
};

export default memo(TreeForm);
