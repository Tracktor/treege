import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import Logo from "./Logo";

test("render logo", () => {
  render(<Logo />);
  const img = screen.getByRole("img");
  expect(img).toBeInTheDocument();
});
