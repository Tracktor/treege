import removeNode from "@/utils/tree/removeNode/removeNode";
import {
  removeDecisionFieldInTreeMock,
  removeDecisionInTreeMock,
  removeNodeInTreeMock,
  removeTreeInTreeMock,
} from "@/utils/tree/removeNode/test/mock";

describe("removeNode", () => {
  test("remove node", () => {
    const { tree, output, treePath, uuid } = removeNodeInTreeMock;
    const result = removeNode({
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("remove tree", () => {
    const { tree, output, treePath, uuid } = removeTreeInTreeMock;
    const result = removeNode({
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("remove decision", () => {
    const { tree, output, treePath, uuid } = removeDecisionInTreeMock;
    const result = removeNode({
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("remove decision Field", () => {
    const { tree, output, treePath, uuid } = removeDecisionFieldInTreeMock;
    const result = removeNode({
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });
});
