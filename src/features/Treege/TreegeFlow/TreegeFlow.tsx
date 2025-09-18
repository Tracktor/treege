import { Box, GlobalStyles, Stack } from "@tracktor/design-system";
import { ReactFlow, Controls, DefaultEdgeOptions } from "@xyflow/react";
import { useContext, useMemo } from "react";
import Logo from "@/components/DataDisplay/Logo/Logo";
import ViewerJSON from "@/components/DataDisplay/ViewerJSON/ViewerJSON";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
import colors from "@/constants/colors";
import { TreegeFlowContext } from "@/features/Treege/context/TreegeFlowProvider";
import edgeTypes from "@/features/Treege/TreegeFlow/Edges/edgesTypes";
import nodeTypes from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const edgeOptions: DefaultEdgeOptions = {
  style: {
    stroke: "#999",
    strokeDasharray: "6 4",
    strokeLinecap: "round",
    strokeWidth: 2,
  },
  type: "orthogonal",
};

const pathClass = "tree-link";

const TreegeFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange } = useContext(TreegeFlowContext);
  const formattedJSON = useMemo(() => [{ edges, node: nodes }], [edges, nodes]);

  return (
    <MosaicLayout>
      <Header>
        <Stack justifyContent="space-between" direction="row" alignItems="center">
          <Logo />
        </Stack>
      </Header>
      <Main>
        <Box
          component="div"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <GlobalStyles
            styles={{
              [`.${pathClass}`]: {
                stroke: `${colors.borderGrey} !important`,
              },
            }}
          />
          <ReactFlow
            fitView
            nodeTypes={nodeTypes}
            nodes={nodes}
            edgeTypes={edgeTypes}
            edges={edges.map((e) => ({ ...e, type: "orthogonal" }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            defaultEdgeOptions={edgeOptions}
          >
            <Controls />
          </ReactFlow>
        </Box>
      </Main>
      <Sidebar>
        <ViewerJSON value={formattedJSON} />
      </Sidebar>
    </MosaicLayout>
  );
};

export default TreegeFlow;
