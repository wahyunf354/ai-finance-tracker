import { formatRupiah } from "@/lib/utils";

describe("formatRupiah", () => {
  it("formats number correctly", () => {
    // Note: The actual output depends on typical IDR formatting, usually "Rp 10.000" or similar
    // The implementation uses Intl.NumberFormat("id-ID", ...).
    // Space between Rp and number is standard in some implementations, let's verify.
    // In node 14+ it is often "Rp 10.000".

    // We normalize spaces to avoid breaking on non-breaking space (NBSP) issues common with currency formatting
    const result = formatRupiah(10000);
    expect(result.replace(/\s/g, " ")).toContain("Rp 10.000");
  });

  it("formats string number correctly", () => {
    const result = formatRupiah("50000");
    expect(result.replace(/\s/g, " ")).toContain("Rp 50.000");
  });

  it("handles messy string input", () => {
    // Implementation: number = Number(String(value).replace(/[^0-9]/g, ""));
    // "Total: 50.000" -> "50000" -> 50000
    const result = formatRupiah("Total: 50.000");
    expect(result.replace(/\s/g, " ")).toContain("Rp 50.000");
  });

  it("handles zero and undefined", () => {
    expect(formatRupiah(0).replace(/\s/g, " ")).toContain("Rp 0");
    // @ts-expect-error testing undefined input
    expect(formatRupiah(undefined)).toBe("Rp 0");
  });
});
