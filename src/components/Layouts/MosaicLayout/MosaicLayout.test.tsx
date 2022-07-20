import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import MosaicLayout from "./MosaicLayout";

test("render <MosaicLayout />", () => {
  const Header = () => <div />;

  const { getByRole } = render(
    <MosaicLayout>
      <Header />
      <Header />
    </MosaicLayout>
  );

  const treeGrid = getByRole("treegrid");

  expect(treeGrid).toBeInTheDocument();
});
