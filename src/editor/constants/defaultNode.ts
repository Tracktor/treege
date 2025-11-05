import { nanoid } from "nanoid";

export const DEFAULT_NODE = {
  data: {
    type: "text",
  },
  id: nanoid(),
  position: { x: 0, y: 0 },
  type: "input",
};
