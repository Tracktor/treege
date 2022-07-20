import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import Logo from "./Logo";

test("render logo", () => {
  render(<Logo />);

  const img = screen.getByRole("img");

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute("alt", "Treege");
  expect(img).toHaveAttribute("height", "30");
  expect(img).toHaveAttribute("width", "auto");
});
