import { render } from "@testing-library/react";
import { test } from "vitest";
import Action from "./Action";

test("render <Action />", () => {
  const { getByRole } = render(<Action />);
  const action = getByRole("group");

  expect(action).toBeInTheDocument();
});
