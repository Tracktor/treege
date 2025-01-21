import {
  updatedAndAddDecisionInFieldWithChildrenMock,
  updatedFirstNodeInTreeMock,
  updatedNodeInComplexeTreeMock,
  updatedNodeInOtherTreeMock,
  updatedTreeMock,
} from "@/utils/tree/updateNodeInTree/test/mock";
import updateNodeInTree from "@/utils/tree/updateNodeInTree/updateNodeInTree";

describe("getNodeNames", () => {
  test("updated first node", () => {
    const { tree, output, treePath, newChild, uuid } = updatedFirstNodeInTreeMock;
    const result = updateNodeInTree({
      children: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Update node in other tree", () => {
    const { tree, output, treePath, newChild, uuid } = updatedNodeInOtherTreeMock;
    const result = updateNodeInTree({
      children: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Update Tree", () => {
    const { tree, output, treePath, newChild, uuid } = updatedTreeMock;
    const result = updateNodeInTree({
      children: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Update Node in complexe Tree", () => {
    const { tree, output, treePath, newChild, uuid } = updatedNodeInComplexeTreeMock;
    const result = updateNodeInTree({
      children: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });

  test("Updated and add decision in field with children", () => {
    const { tree, output, treePath, newChild, uuid } = updatedAndAddDecisionInFieldWithChildrenMock;
    const result = updateNodeInTree({
      children: newChild,
      path: treePath,
      tree,
      uuid,
    });

    expect(result).toEqual(output);
  });
});
