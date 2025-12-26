import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

describe("Card Component", () => {
  it("renders card with all sub-components", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
    expect(screen.getByText("Card Footer")).toBeInTheDocument();
  });

  it("applies custom class names to Card", () => {
    render(<Card className="custom-card-class">Content</Card>);
    // Accessing the container div of the card
    // Since the Card renders a div with data-slot="card", we can try to find it via text directly if it has content
    const card = screen.getByText("Content");
    expect(card).toHaveClass("custom-card-class");
  });

  it("applies custom class names to CardHeader", () => {
    render(<CardHeader className="custom-header-class">Header</CardHeader>);
    const header = screen.getByText("Header");
    expect(header).toHaveClass("custom-header-class");
  });

  it("applies custom class names to CardTitle", () => {
    render(<CardTitle className="custom-title-class">Title</CardTitle>);
    const title = screen.getByText("Title");
    expect(title).toHaveClass("custom-title-class");
  });

  it("applies custom class names to CardDescription", () => {
    render(
      <CardDescription className="custom-desc-class">
        Description
      </CardDescription>
    );
    const desc = screen.getByText("Description");
    expect(desc).toHaveClass("custom-desc-class");
  });

  it("applies custom class names to CardAction", () => {
    render(<CardAction className="custom-action-class">Action</CardAction>);
    const action = screen.getByText("Action");
    expect(action).toHaveClass("custom-action-class");
  });

  it("applies custom class names to CardContent", () => {
    render(<CardContent className="custom-content-class">Content</CardContent>);
    const content = screen.getByText("Content");
    expect(content).toHaveClass("custom-content-class");
  });

  it("applies custom class names to CardFooter", () => {
    render(<CardFooter className="custom-footer-class">Footer</CardFooter>);
    const footer = screen.getByText("Footer");
    expect(footer).toHaveClass("custom-footer-class");
  });
});
