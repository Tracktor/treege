import { render } from "@testing-library/react";
import type { HierarchyPointNode } from "d3-hierarchy";
import { expect, test } from "vitest";
import TreeCard from "./TreeCard";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

describe("test <TreeCard />", () => {
  test("render <TreeCard />", () => {
    const { container } = render(
      <TreeCard
        hierarchyPointNode={{} as HierarchyPointNode<TreeNode>}
        nodeDatum={{
          __rd3t: {
            collapsed: false,
            depth: 1,
            id: "1",
          },
          attributes: {},
          name: "My Test Name",
        }}
        onNodeClick={() => {}}
        onNodeMouseOut={() => {}}
        onNodeMouseOver={() => {}}
        toggleNode={() => {}}
      />
    );

    const name = container.querySelector("h4");

    expect(name?.textContent).toBe(undefined);
  });
});
