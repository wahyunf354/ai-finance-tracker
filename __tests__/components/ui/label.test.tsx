import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label Component", () => {
  it("renders label with correct text", () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(<Label className="custom-class">Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("custom-class");
  });

  it("passes other props correctly", () => {
    render(<Label htmlFor="test-input">ID Label</Label>);
    const label = screen.getByText("ID Label");
    expect(label).toHaveAttribute("for", "test-input");
  });
});
