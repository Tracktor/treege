import { nanoid } from "nanoid";

export const defaultNode = {
  data: {
    type: "text",
  },
  id: nanoid(),
  position: { x: 0, y: 0 },
  type: "input",
};
