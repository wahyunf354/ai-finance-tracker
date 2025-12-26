import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "@/components/navbar";
import { logout } from "@/app/server-actions/auth";
import { useLanguage } from "@/context/LanguageContext";

// Mock dependencies
jest.mock("@/app/server-actions/auth", () => ({
  logout: jest.fn(),
}));

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: jest.fn(),
}));

jest.mock("@/components/mode-toggle", () => ({
  ModeToggle: ({ className }: { className?: string }) => (
    <div data-testid="mode-toggle" className={className}>
      Mode Toggle
    </div>
  ),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
  MockLink.displayName = "Link";
  return MockLink;
});

describe("Navbar Component", () => {
  const mockSetLanguage = jest.fn();
  const mockLogout = logout as jest.Mock;

  const mockTranslations = {
    nav: {
      chat: "Chat",
      dashboard: "Dashboard",
      budget: "Budget",
      history: "History",
      logout: "Logout",
    },
    about: {
      title: "About",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLanguage as jest.Mock).mockReturnValue({
      language: "id",
      setLanguage: mockSetLanguage,
      t: mockTranslations,
    });
  });

  test("renders all navigation links with correct text and hrefs", () => {
    render(<Navbar />);

    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Chat").closest("a")).toHaveAttribute("href", "/");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );

    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Budget").closest("a")).toHaveAttribute(
      "href",
      "/budget"
    );

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("History").closest("a")).toHaveAttribute(
      "href",
      "/transactions"
    );

    // Hidden on mobile by default, but should be in the document structure
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("About").closest("a")).toHaveAttribute(
      "href",
      "/about"
    );
  });

  test("calls logout function when logout button is clicked", async () => {
    render(<Navbar />);

    // The logout button is typically hidden on mobile in the current implementation,
    // but we can still find it in the DOM or simulate a click if it's rendered.
    // The component has `hidden md:flex` for the logout button.
    const logoutText = screen.getByText("Logout");
    const logoutButton = logoutText.closest("button");

    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton!);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  test("toggles language when language button is clicked", () => {
    // Initial state is 'id'
    render(<Navbar />);

    // The language button is hidden on mobile: `hidden md:flex`
    const languageButton = screen.getByTitle("Switch Language");

    fireEvent.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledWith("en");
  });

  test("toggles language from en back to id", () => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: "en",
      setLanguage: mockSetLanguage,
      t: mockTranslations,
    });

    render(<Navbar />);

    const languageButton = screen.getByTitle("Switch Language");

    fireEvent.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledWith("id");
  });

  test("render mode toggle component", () => {
    render(<Navbar />);
    expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
  });
});
