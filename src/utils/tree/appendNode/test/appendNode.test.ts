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
    const { tree, output, treePath, newChild, uuid } = addFirstNodeInTreeMock;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Initialise Tree", () => {
    const { tree, output, treePath, newChild, uuid } = initialiseTree;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Add node in tree null", () => {
    const { tree, output, treePath, newChild, uuid } = addNodeInTreeMock;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Add node in other tree", () => {
    const { tree, output, treePath, newChild, uuid } = addNodeOtherTreeMock;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Add node decision in other tree", () => {
    const { tree, output, treePath, newChild, uuid } = addNodeOtherTreeMock;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Add node decision in other tree", () => {
    const { tree, output, treePath, newChild, uuid } = addNodeDecisionInOtherTreeMock;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Add Tree node", () => {
    const { tree, output, treePath, newChild, uuid } = addTreeNodeMock;
    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Add node between nodes", () => {
    const { treePath, tree, uuid, output, newChild } = addNodeBetweenNodes;

    const result = appendNode({
      child: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });
});
