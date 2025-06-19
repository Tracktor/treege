import { removeNode } from "@/utils/tree";
import {
  removeDecisionFieldInTreeMock,
  removeDecisionInTreeMock,
  removeNodeInTreeMock,
  removeTreeInTreeMock,
  removeNodeWithParamsAncestorReferencesMock,
  removeNodeWithAncestorReferencesMock,
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

  test("remove node with ancestor references", () => {
    const { tree, output, treePath, uuid } = removeNodeWithAncestorReferencesMock;
    const result = removeNode({
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("remove tree with params references", () => {
    const { tree, output, uuid, treePath } = removeNodeWithParamsAncestorReferencesMock;
    const result = removeNode({
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });
});
