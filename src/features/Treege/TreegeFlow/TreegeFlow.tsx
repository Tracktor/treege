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
import useAutoFitView from "@/features/Treege/TreegeFlow/Layout/useAutoFitView";
import nodesType from "@/features/Treege/TreegeFlow/Nodes/nodesType";
import reactFlowToMinimal from "@/features/Treege/TreegeFlow/utils/toMinimalConverter";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

const pathClass = "tree-link";

const TreegeFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, graph } = useTreegeFlowContext();
  const minimalGraph = reactFlowToMinimal(nodes, edges);
  const isGraphEmpty = !graph || graph.nodes.length === 0;

  useAutoFitView(nodes, edges);

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
                [`.${pathClass}`]: {
                  stroke: `${colors.borderGrey} !important`,
                },
              }}
            />
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
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
