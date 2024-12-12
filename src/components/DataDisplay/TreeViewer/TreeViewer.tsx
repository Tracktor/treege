import { Box, CircularProgress, GlobalStyles } from "@tracktor/design-system";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import { memo } from "react";
import { nodeTypes } from "@/components/DataDisplay/Nodes";
import useTreeViewer from "@/components/DataDisplay/TreeViewer/useTreeViewer";
import colors from "@/constants/colors";
import ButtonCreateTree from "@/features/Treege/components/Inputs/ButtonCreateTree/ButtonCreateTree";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import "@xyflow/react/dist/style.css";

interface TreeViewerProps {
  data: TreeNode | null;
  isLoading?: boolean;
}

const styles = {
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  progressContainer: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
  },
};

const TreeViewer = ({ data, isLoading }: TreeViewerProps) => {
  const { nodes, edges, onConnect, onNodesChange, onEdgesChange } = useTreeViewer(data);

  if (!data) {
    return <ButtonCreateTree />;
  }

  if (isLoading) {
    return (
      <Box sx={styles.progressContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={styles.container}>
      <GlobalStyles
        styles={{
          ".react-flow__panel a ": {
            display: "none",
          },
        }}
      />
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        className="antialiased"
        colorMode="dark"
      >
        <Background color={colors.primary} bgColor={colors.background} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default memo(TreeViewer);
