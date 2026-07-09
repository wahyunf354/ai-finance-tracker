import { exportToPDF } from "@/lib/export-pdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Mock jsPDF
const mockJsPDFInstance = {
  setFontSize: jest.fn(),
  setTextColor: jest.fn(),
  text: jest.fn(),
  setFillColor: jest.fn(),
  rect: jest.fn(),
  roundedRect: jest.fn(),
  save: jest.fn(),
  internal: {
    pageSize: { height: 297, width: 210 },
  },
  getNumberOfPages: jest.fn().mockReturnValue(1),
};

jest.mock("jspdf", () => {
  return jest.fn(() => mockJsPDFInstance);
});

jest.mock("jspdf-autotable", () => jest.fn());

describe("exportToPDF", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate PDF and save it", () => {
    const transactions = [
      {
        id: "1",
        created_at: new Date().toISOString(),
        amount: 50000,
        type: "expense" as const,
        category: "Food",
        description: "Lunch",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        created_at: new Date().toISOString(),
        amount: 100000,
        type: "income" as const,
        category: "Salary",
        description: "Work",
        date: new Date().toISOString(),
      },
    ];

    exportToPDF(transactions);

    // Verify basic PDF operations
    expect(jsPDF).toHaveBeenCalled();
    expect(mockJsPDFInstance.setFontSize).toHaveBeenCalled();
    expect(mockJsPDFInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("Finflow"),
      expect.any(Number),
      expect.any(Number)
    );

    // Verify AutoTable was called
    expect(autoTable).toHaveBeenCalled();

    // Verify Save
    expect(mockJsPDFInstance.save).toHaveBeenCalledWith(
      expect.stringMatching(/^finflow_report_.*\.pdf$/)
    );
  });
});
