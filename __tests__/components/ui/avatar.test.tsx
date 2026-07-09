import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock Radix Avatar primitives to test our wrapper logic without relying on browser image loading
jest.mock("@radix-ui/react-avatar", () => ({
  Root: ({ className, children, ...props }: React.ComponentProps<"div">) => (
    <div data-testid="avatar-root" className={className} {...props}>
      {children}
    </div>
  ),
  Image: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="avatar-image"
      className={className}
      alt={alt || "avatar"}
      {...props}
    />
  ),
  Fallback: ({
    className,
    children,
    ...props
  }: React.ComponentProps<"div">) => (
    <div data-testid="avatar-fallback" className={className} {...props}>
      {children}
    </div>
  ),
}));

describe("Avatar Component", () => {
  it("renders avatar image with correct props", () => {
    render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );

    // With our mock, Image is always rendered if component is present
    const image = screen.getByRole("img", { name: "@shadcn" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://github.com/shadcn.png");
  });

  it("renders fallback with correct props", () => {
    render(
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByText("CN");
    expect(fallback).toBeInTheDocument();
  });
});
