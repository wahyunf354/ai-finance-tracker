import { formatRupiah, formatCompactNumber } from "@/lib/utils";

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

describe("formatCompactNumber", () => {
  it("formats numbers < 1000 correctly", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(500)).toBe("500");
    expect(formatCompactNumber(999)).toBe("999");
  });

  it("formats thousands (k) correctly", () => {
    expect(formatCompactNumber(1000)).toBe("1k");
    expect(formatCompactNumber(1500)).toBe("2k"); // toFixed(0) rounds up 1.5 -> 2
    expect(formatCompactNumber(1400)).toBe("1k"); // toFixed(0) rounds down 1.4 -> 1
    expect(formatCompactNumber(10000)).toBe("10k");
    expect(formatCompactNumber(999999)).toBe("1000k"); // 999.999 -> 1000k
  });

  it("formats millions (jt) correctly", () => {
    expect(formatCompactNumber(1000000)).toBe("1jt");
    expect(formatCompactNumber(1500000)).toBe("1.5jt");
    expect(formatCompactNumber(2000000)).toBe("2jt"); // .replace(/\.0$/, "") handles this
    expect(formatCompactNumber(1230000)).toBe("1.2jt");
  });

  it("formats billions (M) correctly", () => {
    expect(formatCompactNumber(1000000000)).toBe("1M");
    expect(formatCompactNumber(1500000000)).toBe("1.5M");
    expect(formatCompactNumber(2500000000)).toBe("2.5M");
  });
});

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("c1", "c2")).toBe("c1 c2");
  });

  it("handles conditional classes", () => {
    expect(cn("c1", true && "c2", false && "c3")).toBe("c1 c2");
  });

  it("overrides conflicting tailwind classes", () => {
    // p-4 should overwrite p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
    // text-red-500 should overwrite text-blue-500
    expect(cn("text-blue-500", "text-red-500")).toBe("text-red-500");
  });
});
