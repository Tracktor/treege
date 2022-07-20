import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Header from "./Header";

test("render <Header />", () => {
  const { container } = render(<Header />);
  const action = container.querySelector("header");

  expect(action).toBeInTheDocument();
});
