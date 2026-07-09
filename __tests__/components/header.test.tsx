import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Header from "@/components/header";
import { ComponentProps, ReactNode } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { logout } from "@/app/server-actions/auth";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

// Mock LanguageContext
jest.mock("@/context/LanguageContext", () => ({
  useLanguage: jest.fn(),
}));

// Mock server actions
jest.mock("@/app/server-actions/auth", () => ({
  logout: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: ComponentProps<"div"> & { [key: string]: unknown }) => (
      <div className={className} {...(props as ComponentProps<"div">)}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("Header Component", () => {
  const mockSetTheme = jest.fn();
  const mockSetLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.jpg",
        is_premium: true,
      }),
    });

    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    (useLanguage as jest.Mock).mockReturnValue({
      language: "en",
      setLanguage: mockSetLanguage,
      t: {
        header: { title: "Finance Tracker" },
        about: { title: "About" },
        settings: { title: "Settings" },
      },
    });
  });

  it("renders header title correctly", async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByText("Finance Tracker")).toBeInTheDocument();
  });

  it("fetches and displays user data", async () => {
    await act(async () => {
      render(<Header />);
    });

    // Open menu to see user info
    const menuButton = screen.getByLabelText("Menu");
    fireEvent.click(menuButton);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("PREMIUM")).toBeInTheDocument();
  });

  it("handles fetch error gracefully (Guest User)", async () => {
    // Suppress console.error for this test as we expect an error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockFetch.mockRejectedValue(new Error("Failed to fetch"));

    await act(async () => {
      render(<Header />);
    });

    const menuButton = screen.getByLabelText("Menu");
    fireEvent.click(menuButton);

    expect(screen.getByText("Guest User")).toBeInTheDocument();
    expect(screen.getByText("Sign in to sync")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("toggles menu open and close", async () => {
    await act(async () => {
      render(<Header />);
    });

    const menuButton = screen.getByLabelText("Menu");

    // Open
    fireEvent.click(menuButton);
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Close
    fireEvent.click(menuButton);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("closes menu when clicking outside", async () => {
    await act(async () => {
      render(
        <div>
          <Header />
          <div data-testid="outside">Outside</div>
        </div>
      );
    });

    const menuButton = screen.getByLabelText("Menu");
    fireEvent.click(menuButton);
    expect(screen.getByText("Logout")).toBeInTheDocument();

    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);

    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("changes theme when theme buttons are clicked", async () => {
    await act(async () => {
      render(<Header />);
    });

    fireEvent.click(screen.getByLabelText("Menu"));

    // Attempt to locate theme buttons more reliably
    // The theme buttons are inside a grid container after "Theme" label
    // We can assume they are button elements.
    // Let's filter buttons that trigger the mock.

    // However, finding them by index:
    // 0: Menu button
    // 1: Light
    // 2: Dark
    // 3: System
    // 4: Language
    // 5: Logout

    const buttons = screen.getAllByRole("button");
    const lightBtn = buttons[1];
    const darkBtn = buttons[2];
    const systemBtn = buttons[3];

    expect(lightBtn).toBeInTheDocument();
    expect(darkBtn).toBeInTheDocument();
    expect(systemBtn).toBeInTheDocument();

    fireEvent.click(lightBtn);
    expect(mockSetTheme).toHaveBeenCalledWith("light");

    fireEvent.click(darkBtn);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");

    fireEvent.click(systemBtn);
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  it("toggles language", async () => {
    await act(async () => {
      render(<Header />);
    });

    fireEvent.click(screen.getByLabelText("Menu"));

    const languageBtn = screen.getByText("Language").closest("button");
    fireEvent.click(languageBtn!);

    expect(mockSetLanguage).toHaveBeenCalledWith("id");
  });

  it("calls logout when logout button is clicked", async () => {
    await act(async () => {
      render(<Header />);
    });

    fireEvent.click(screen.getByLabelText("Menu"));

    const logoutBtn = screen.getByText("Logout").closest("button");
    fireEvent.click(logoutBtn!);

    expect(logout).toHaveBeenCalled();
  });
});
