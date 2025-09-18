import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { Handle, Node, NodeProps, Position, useNodeConnections } from "@xyflow/react";
import { memo } from "react";
import colors from "@/constants/colors";
import HandleSource from "@/features/Treege/TreegeFlow/Handlers/HandleSource";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const OptionNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const parentConnections = useNodeConnections({ handleType: "target" });
  const childConnections = useNodeConnections({ handleType: "source" });
  const { name, order, onAddNode } = data;

  return (
    <Box component="div">
      {parentConnections.length !== 0 && <Handle type="target" position={Position.Top} />}

      <Card
        sx={{
          background: colors.background,
          borderColor: colors.secondary,
          borderRadius: "1rem",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 150,
            justifyContent: "space-between",
            width: 200,
          }}
        >
          <Stack spacing={2} alignItems="flex-end">
            <Typography variant="h5">
              {name} (#{order})
            </Typography>
            <Chip color="info" size="small" label="text" />

            <Stack sx={{ gap: 1 }}>
              <IconButton size="small" color="success" onClick={() => {}}>
                <AddBoxRoundedIcon
                  sx={{
                    color: "success",
                    fontSize: 20,
                  }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <HandleSource handleId={`${id}-out`} position={Position.Bottom} rotation="0deg" />
    </Box>
  );
};

export default memo(OptionNode);
