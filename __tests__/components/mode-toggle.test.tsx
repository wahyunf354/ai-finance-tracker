import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import { ComponentProps, ReactNode } from "react";
// Framer Motion mock usually handles itself reasonably well in tests or we can stub it if needed,
// but mounting it is usually essential for AnimatePresence logic as it renders or removes children.

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

// Mock framer-motion to render children immediately without animation delays to avoid flaky tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      onClick,
      ...props
    }: ComponentProps<"div"> & { [key: string]: unknown }) => (
      <div
        className={className}
        onClick={onClick}
        {...(props as ComponentProps<"div">)}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("ModeToggle Component", () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: "system",
      setTheme: setThemeMock,
    });
  });

  it("renders correctly", () => {
    render(<ModeToggle />);
    const button = screen.getByTitle("Theme");
    expect(button).toBeInTheDocument();
  });

  it("toggles dropdown on click", () => {
    render(<ModeToggle />);
    const button = screen.getByTitle("Theme");

    // Initially closed (query by text since role might be ambiguous if button isn't labeled)
    expect(screen.queryByText("Dark")).not.toBeInTheDocument();

    fireEvent.click(button);

    // Now open
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("changes theme to light when Light option is clicked", () => {
    render(<ModeToggle />);
    const button = screen.getByTitle("Theme");
    fireEvent.click(button); // Open dropdown

    const lightOption = screen.getByText("Light");
    fireEvent.click(lightOption);

    expect(setThemeMock).toHaveBeenCalledWith("light");
  });

  it("changes theme to dark when Dark option is clicked", () => {
    render(<ModeToggle />);
    const button = screen.getByTitle("Theme");
    fireEvent.click(button);

    const darkOption = screen.getByText("Dark");
    fireEvent.click(darkOption);

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("changes theme to system when System option is clicked", () => {
    render(<ModeToggle />);
    const button = screen.getByTitle("Theme");
    fireEvent.click(button);

    const systemOption = screen.getByText("System");
    fireEvent.click(systemOption);

    expect(setThemeMock).toHaveBeenCalledWith("system");
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <ModeToggle />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const button = screen.getByTitle("Theme");
    fireEvent.click(button);
    expect(screen.getByText("Dark")).toBeInTheDocument();

    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);

    expect(screen.queryByText("Dark")).not.toBeInTheDocument();
  });
});
