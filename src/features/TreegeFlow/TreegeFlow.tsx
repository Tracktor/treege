import SettingsIcon from "@mui/icons-material/Settings";
import { Box, GlobalStyles, Stack, Button, ButtonGroup, Typography, IconButton, Popover } from "@tracktor/design-system";
import { ReactFlow, Controls } from "@xyflow/react";
import Logo from "@/components/DataDisplay/Logo/Logo";
import ViewerJSON from "@/components/DataDisplay/ViewerJSON/ViewerJSON";
import Header from "@/components/Layouts/Header/Header";
import Main from "@/components/Layouts/Main/Main";
import MosaicLayout from "@/components/Layouts/MosaicLayout/MosaicLayout";
import Sidebar from "@/components/Layouts/Sidebar/Sidebar";
import colors from "@/constants/colors";
import edgesTypes from "@/features/TreegeFlow/Edges/edgesTypes";
import nodesType from "@/features/TreegeFlow/Nodes/nodesType";
import useTreegeFlow from "@/features/TreegeFlow/useTreegeFlow";
import ButtonCreateGraph from "@/features/TreegeTree/components/Inputs/ButtonCreateGraph";

const TreegeFlow = () => {
  const {
    open,
    anchorEl,
    handleOpen,
    handleClose,
    nodes,
    onNodesChange,
    onEdgesChange,
    edges,
    onConnect,
    minimalGraph,
    isGraphEmpty,
    handleViewerChange,
    layoutEngineName,
    setLayoutEngineName,
  } = useTreegeFlow();

  return (
    <MosaicLayout>
      <Header>
        <Stack justifyContent="space-between" direction="row" alignItems="center">
          <Logo />
          <IconButton onClick={handleOpen} size="small">
            <SettingsIcon />
          </IconButton>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
          >
            <Box p={2}>
              <Stack alignItems="center" spacing={2}>
                <Typography>Layout Engine:</Typography>

                <ButtonGroup
                  variant="outlined"
                  size="small"
                  sx={{
                    display: "flex",
                    width: 200,
                  }}
                >
                  <Button
                    onClick={() => setLayoutEngineName("dagre")}
                    variant={layoutEngineName === "dagre" ? "contained" : "outlined"}
                    sx={{ flex: 1 }}
                  >
                    Dagre
                  </Button>
                  <Button
                    onClick={() => setLayoutEngineName("elk")}
                    variant={layoutEngineName === "elk" ? "contained" : "outlined"}
                    sx={{ flex: 1 }}
                  >
                    ELK
                  </Button>
                </ButtonGroup>
              </Stack>
            </Box>
          </Popover>
        </Stack>
      </Header>
      <Main>
        {isGraphEmpty ? (
          <ButtonCreateGraph />
        ) : (
          <Box component="div" style={{ height: "100%", width: "100%" }}>
            <GlobalStyles
              styles={{
                ".react-flow__controls": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
                ".react-flow__controls-button": {
                  backgroundColor: colors.tertiary,
                  border: `1px solid ${colors.borderGrey}`,
                },
                ".react-flow__controls-button:hover": {
                  backgroundColor: colors.background,
                },
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
              maxZoom={5}
              minZoom={0.1}
              proOptions={{ hideAttribution: true }}
            >
              <Controls />
            </ReactFlow>
          </Box>
        )}
      </Main>
      <Sidebar>
        <ViewerJSON value={minimalGraph} onChange={handleViewerChange} />
      </Sidebar>
    </MosaicLayout>
  );
};

export default TreegeFlow;
