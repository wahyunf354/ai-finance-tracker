import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock Radix Dialog
// Since Radix Dialog uses portals and complex state, mocking is often cleaner for unit tests
// unless we want to test the integration deeply. For basic component structure checks, mocking suffices.
// However, to check if 'open' state works, we can try using the real component or a simplified mock.
// Let's rely on standard behavior but mock ResizeObserver if needed (not needed for basic render).
// Actually, Radix primitives often need `ResizeObserver` which is missing in JSDOM.

beforeEach(() => {
  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Dialog Component", () => {
  it("renders dialog trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    const trigger = screen.getByText("Open Dialog");
    expect(trigger).toBeInTheDocument();
  });

  it("opens dialog content on trigger click", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText("Open Dialog");
    fireEvent.click(trigger);

    // Radix Dialog content is rendered in a Portal, usually appended to body.
    // We can query by role 'dialog' or by text.
    const dialogTitle = screen.getByText("Dialog Title");
    expect(dialogTitle).toBeInTheDocument();

    expect(screen.getByText("Dialog Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
