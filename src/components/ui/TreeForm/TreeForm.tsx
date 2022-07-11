import { memo } from "react";
import Tree from "react-d3-tree";
import type { RenderCustomNodeElementFn } from "react-d3-tree/lib/types/common";
import styles from "./TreeForm.module.scss";
import useTreeForm from "@/components/ui/TreeForm/useTreeForm";

interface TreeDragZoneProps {
  data: any;
  nodeSize?: { x: number; y: number };
  renderCustomNodeElement?: RenderCustomNodeElementFn;
}

const TreeForm = ({
  data,
  renderCustomNodeElement,
  nodeSize = {
    x: 300,
    y: 300,
  },
}: TreeDragZoneProps) => {
  const { dimensions, refContainer, translate } = useTreeForm();

  return (
    <div className={styles.Container} ref={refContainer}>
      <Tree
        data={data}
        orientation="vertical"
        translate={translate}
        dimensions={dimensions}
        renderCustomNodeElement={renderCustomNodeElement}
        pathFunc="diagonal"
        pathClassFunc={() => styles.Link}
        nodeSize={nodeSize}
      />
    </div>
  );
};

export default memo(TreeForm);
