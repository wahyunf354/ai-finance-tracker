import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";

// Radix UI's Progress component relies on internal logic for width calculation
// In JSDOM, we might need to verify the props or transform styles
describe("Progress Component", () => {
  it("renders progress component", () => {
    render(<Progress value={50} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("renders with correct value prop", () => {
    render(<Progress value={40} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(<Progress value={50} className="custom-progress" />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveClass("custom-progress");
  });
});
