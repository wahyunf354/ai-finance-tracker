import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { Transaction } from "@/types";

export async function POST(request: Request) {
  try {
    const { transactions } = (await request.json()) as {
      transactions: Transaction[];
    };

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Keuangan");

    // Define columns
    sheet.columns = [
      { header: "Tanggal", key: "tanggal", width: 15 },
      { header: "Jenis", key: "jenis", width: 15 },
      { header: "Kategori", key: "kategori", width: 20 },
      { header: "Nominal", key: "nominal", width: 20 },
      { header: "Catatan", key: "catatan", width: 30 },
    ];

    // Add rows
    transactions.forEach((t) => {
      sheet.addRow(t);
    });

    // Style the header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return response with headers for download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="laporan-keuangan.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
