import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Sidebar from "./Sidebar";

test("render <Sidebar />", () => {
  const { container } = render(<Sidebar />);
  const header = container.querySelector("aside");

  expect(header).toBeInTheDocument();
});
