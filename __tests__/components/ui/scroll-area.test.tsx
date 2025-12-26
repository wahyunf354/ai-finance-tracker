import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock ScrollArea primitives since they heavily rely on layout measurement not present in JSDOM
jest.mock("@radix-ui/react-scroll-area", () => ({
  Root: ({ children, className, ...props }: React.ComponentProps<"div">) => (
    <div data-testid="scroll-area-root" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({
    children,
    className,
    ...props
  }: React.ComponentProps<"div">) => (
    <div data-testid="scroll-area-viewport" className={className} {...props}>
      {children}
    </div>
  ),
  ScrollAreaScrollbar: ({
    children,
    className,
    ...props
  }: React.ComponentProps<"div">) => (
    <div data-testid="scroll-area-scrollbar" className={className} {...props}>
      {children}
    </div>
  ),
  ScrollAreaThumb: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div data-testid="scroll-area-thumb" className={className} {...props} />
  ),
  Corner: () => <div data-testid="scroll-area-corner" />,
}));

describe("ScrollArea Component", () => {
  it("renders scroll area with content", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-area-root")).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(
      <ScrollArea className="custom-class">
        <div>Content</div>
      </ScrollArea>
    );
    expect(screen.getByTestId("scroll-area-root")).toHaveClass("custom-class");
  });

  it("renders scrollbars", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    expect(screen.getByTestId("scroll-area-scrollbar")).toBeInTheDocument();
  });
});
