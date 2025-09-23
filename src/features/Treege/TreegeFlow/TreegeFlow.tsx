import { Box, GlobalStyles, Stack } from "@tracktor/design-system";
import { ReactFlow, Controls } from "@xyflow/react";
import Logo from "@/components/DataDisplay/Logo/Logo";
import ViewerJSON from "@/components/DataDisplay/ViewerJSON/ViewerJSON";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
import colors from "@/constants/colors";
import ButtonCreateGraph from "@/features/Treege/components/Inputs/ButtonCreateGraph";
import edgesTypes from "@/features/Treege/TreegeFlow/Edges/edgesTypes";
import nodesType from "@/features/Treege/TreegeFlow/Nodes/nodesType";
import useTreegeFlow from "@/features/Treege/TreegeFlow/useTreegeFlow";

const TreegeFlow = () => {
  const { nodes, onNodesChange, onEdgesChange, edges, onConnect, minimalGraph, isGraphEmpty } = useTreegeFlow();

  return (
    <MosaicLayout>
      <Header>
        <Stack justifyContent="space-between" direction="row" alignItems="center">
          <Logo />
        </Stack>
      </Header>
      <Main>
        {isGraphEmpty ? (
          <ButtonCreateGraph />
        ) : (
          <Box
            component="div"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <GlobalStyles
              styles={{
                ".tree-link": {
                  stroke: `${colors.borderGrey} !important`,
                },
              }}
            />
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodesType}
              edgeTypes={edgesTypes}
            >
              <Controls />
            </ReactFlow>
          </Box>
        )}
      </Main>
      <Sidebar>
        <ViewerJSON value={minimalGraph} />
      </Sidebar>
    </MosaicLayout>
  );
};

export default TreegeFlow;
