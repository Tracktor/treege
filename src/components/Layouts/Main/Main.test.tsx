import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Main from "./Main";

test("render <Main />", () => {
  const { container } = render(<Main />);
  const header = container.querySelector("main");

  expect(header).toBeInTheDocument();
  expect(header).toHaveAttribute("role", "tree");
});
