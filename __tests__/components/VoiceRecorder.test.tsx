import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import VoiceRecorder from "@/components/VoiceRecorder";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: React.ComponentProps<"div">) => (
      <div className={className}>{children}</div>
    ),
  },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock MediaRecorder and getUserMedia
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockStopTrack = jest.fn();

class MockMediaRecorder {
  ondataavailable: ((e: BlobEvent) => void) | null = null;
  onstop: (() => void) | null = null;
  state: "inactive" | "recording" = "inactive";

  start() {
    mockStart();
    this.state = "recording";
  }

  stop() {
    mockStop();
    this.state = "inactive";
    if (this.onstop) {
      this.onstop();
    }
  }
}

// Assign to global
Object.defineProperty(window, "MediaRecorder", {
  writable: true,
  value: MockMediaRecorder,
});

Object.defineProperty(navigator, "mediaDevices", {
  writable: true,
  value: {
    getUserMedia: jest.fn(),
  },
});

describe("VoiceRecorder Component", () => {
  const mockOnProcessingStart = jest.fn();
  const mockOnProcessingComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default successful stream mock
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue({
      getTracks: () => [{ stop: mockStopTrack }],
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", data: "processed data" }),
    });
  });

  it("renders correctly in initial state", () => {
    render(
      <VoiceRecorder
        onProcessingStart={mockOnProcessingStart}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    expect(screen.getByText("Tekan untuk Bicara")).toBeInTheDocument();
    expect(
      screen.getByText("AI akan mencatat otomatis ke Excel")
    ).toBeInTheDocument();
  });

  it("starts recording when clicked", async () => {
    render(
      <VoiceRecorder
        onProcessingStart={mockOnProcessingStart}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: true,
    });
    expect(mockStart).toHaveBeenCalled();
    expect(screen.getByText("Merekam...")).toBeInTheDocument();
    expect(screen.getByText(/Katakan pengeluaranmu/i)).toBeInTheDocument();
  });

  it("stops recording and processes audio when clicked again", async () => {
    render(
      <VoiceRecorder
        onProcessingStart={mockOnProcessingStart}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const button = screen.getByRole("button");

    // Start
    await act(async () => {
      fireEvent.click(button);
    });

    // Stop
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockStop).toHaveBeenCalled();
    expect(mockStopTrack).toHaveBeenCalled();

    expect(mockOnProcessingStart).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/process-voice",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );

    await waitFor(() => {
      expect(mockOnProcessingComplete).toHaveBeenCalledWith({
        status: "success",
        data: "processed data",
      });
    });
  });

  it("handles microphone access error", async () => {
    // Suppress console.error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(
      new Error("Permission denied")
    );

    render(
      <VoiceRecorder
        onProcessingStart={mockOnProcessingStart}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockAlert).toHaveBeenCalledWith(
      "Gagal mengakses mikrofon. Pastikan izin diberikan."
    );

    consoleSpy.mockRestore();
  });

  it("handles processing error", async () => {
    // Suppress console.error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockFetch.mockRejectedValue(new Error("Network error"));

    render(
      <VoiceRecorder
        onProcessingStart={mockOnProcessingStart}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const button = screen.getByRole("button");

    // Start
    await act(async () => {
      fireEvent.click(button);
    });

    // Stop
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Gagal memproses audio.");
    });

    consoleSpy.mockRestore();
  });

  it("disables button when disabled prop is true", () => {
    render(
      <VoiceRecorder
        onProcessingStart={mockOnProcessingStart}
        onProcessingComplete={mockOnProcessingComplete}
        disabled={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
