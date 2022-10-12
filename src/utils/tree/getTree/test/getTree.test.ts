import getTree from "@/utils/tree/getTree/getTree";
import {
  complexeMockWithDecisionMock,
  multiplTreeInMainTreeMock,
  treeInCurrentTreeMock,
  treeInDecisionMock,
  treeInMainTreeMock,
  treeInTreeMock,
} from "@/utils/tree/getTree/test/mock";

describe("On tree in main tree", () => {
  test("tree With one Field", () => {
    const { input, output, searchPath } = treeInMainTreeMock;
    const result = getTree(input, searchPath);

    expect(result).toEqual(output);
  });

  test("tree In Main tree", () => {
    const { input, output, searchPath } = treeInCurrentTreeMock;
    const result = getTree(input, searchPath);

    expect(result).toEqual(output);
  });

  test("Multiple tree in main tree", () => {
    const { input, output, searchPath } = multiplTreeInMainTreeMock;
    const result = getTree(input, searchPath);

    expect(result).toEqual(output);
  });

  test("tree in tree", () => {
    const { input, output, searchPath } = treeInTreeMock;
    const result = getTree(input, searchPath);

    expect(result).toEqual(output);
  });

  test("tree in decision field", () => {
    const { input, output, searchPath } = treeInDecisionMock;
    const result = getTree(input, searchPath);

    expect(result).toEqual(output);
  });

  test("Complexe tree", () => {
    const { input, output, searchPath } = complexeMockWithDecisionMock;
    const result = getTree(input, searchPath);

    expect(result).toEqual(output);
  });
});
