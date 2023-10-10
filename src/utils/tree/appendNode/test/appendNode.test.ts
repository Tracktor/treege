import { appendNode } from "@/utils/tree";
import {
  addFirstNodeInTreeMock,
  addNodeBetweenNodes,
  addNodeDecisionInOtherTreeMock,
  addNodeInTreeMock,
  addNodeOtherTreeMock,
  addTreeNodeMock,
  initialiseTree,
} from "@/utils/tree/appendNode/test/mock";

describe("getNodeNames", () => {
  test("Add first node", () => {
    const { tree, output, treePath, newChild, name } = addFirstNodeInTreeMock;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Initialise Tree", () => {
    const { tree, output, treePath, newChild, name } = initialiseTree;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Add node in tree null", () => {
    const { tree, output, treePath, newChild, name } = addNodeInTreeMock;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Add node in other tree", () => {
    const { tree, output, treePath, newChild, name } = addNodeOtherTreeMock;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Add node decision in other tree", () => {
    const { tree, output, treePath, newChild, name } = addNodeOtherTreeMock;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Add node decision in other tree", () => {
    const { tree, output, treePath, newChild, name } = addNodeDecisionInOtherTreeMock;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Add Tree node", () => {
    const { tree, output, treePath, newChild, name } = addTreeNodeMock;
    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });

  test("Add node between nodes", () => {
    const { treePath, tree, name, output, newChild } = addNodeBetweenNodes;

    const result = appendNode({
      child: newChild,
      name,
      path: treePath,
      tree,
    });

    expect(result).toEqual(output);
  });
});
