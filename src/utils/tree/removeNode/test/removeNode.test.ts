import { expect } from "vitest";
import { removeNode } from "@/utils/tree";
import {
  removeDecisionFieldInTreeMock,
  removeDecisionInTreeMock,
  removeNodeInTreeMock,
  removeTreeInTreeMock,
} from "@/utils/tree/removeNode/test/mock";

describe("removeNode", () => {
  test("remove node", () => {
    const { tree, output, treePath, name } = removeNodeInTreeMock;
    const result = removeNode({
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("remove tree", () => {
    const { tree, output, treePath, name } = removeTreeInTreeMock;
    const result = removeNode({
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("remove decision", () => {
    const { tree, output, treePath, name } = removeDecisionInTreeMock;
    const result = removeNode({
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("remove decision Field", () => {
    const { tree, output, treePath, name } = removeDecisionFieldInTreeMock;
    const result = removeNode({
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });
});
