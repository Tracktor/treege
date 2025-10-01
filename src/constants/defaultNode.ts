import { nanoid } from "nanoid";

const defaultNode = {
  data: {},
  id: nanoid(),
  position: { x: 0, y: 0 },
  type: "input",
};

export default defaultNode;
