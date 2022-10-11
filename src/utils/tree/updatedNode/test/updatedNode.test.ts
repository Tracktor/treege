import { expect } from "vitest";
import { updatedNode } from "@/utils/tree";
import {
  updatedAndAddDecisionInFieldWithChildrenMock,
  updatedFirstNodeInTreeMock,
  updatedNodeInComplexeTreeMock,
  updatedNodeInOtherTreeMock,
  updatedTreeMock,
} from "@/utils/tree/updatedNode/test/mock";

describe("getNodeNames", () => {
  test("updated first node", () => {
    const { tree, output, treePath, newChild, name } = updatedFirstNodeInTreeMock;
    const result = updatedNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Update node in other tree", () => {
    const { tree, output, treePath, newChild, name } = updatedNodeInOtherTreeMock;
    const result = updatedNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Update Tree", () => {
    const { tree, output, treePath, newChild, name } = updatedTreeMock;
    const result = updatedNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Update Node in complexe Tree", () => {
    const { tree, output, treePath, newChild, name } = updatedNodeInComplexeTreeMock;
    const result = updatedNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Updated and add decision in field with children", () => {
    const { tree, output, treePath, newChild, name } = updatedAndAddDecisionInFieldWithChildrenMock;
    const result = updatedNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });
});
