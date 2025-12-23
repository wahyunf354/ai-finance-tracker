import { NextResponse } from "next/server";
import { Transaction } from "@/types";

// MOCK API for demonstration purposes.
// In production, this would connect to OpenAI Whisper + GPT-4.

export async function POST(request: Request) {
  try {
    // 1. Simulate receiving audio file
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // 2. Simulate processing delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Mock transcript (as if Whisper processed it)
    const mockTranscript =
      "Hari ini beli kopi 25 ribu dan makan siang 40 ribu. Kemarin bensin 100 ribu, parkir 10 ribu. Terus gajian masuk 5 juta.";

    // 4. Mock AI Analysis (as if GPT-4 parsed it)
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    const mockData: Transaction[] = [
      {
        id: crypto.randomUUID(),
        tanggal: today,
        jenis: "pengeluaran",
        kategori: "Makanan",
        nominal: 25000,
        catatan: "beli kopi",
      },
      {
        id: crypto.randomUUID(),
        tanggal: today,
        jenis: "pengeluaran",
        kategori: "Makanan",
        nominal: 40000,
        catatan: "makan siang",
      },
      {
        id: crypto.randomUUID(),
        tanggal: yesterday,
        jenis: "pengeluaran",
        kategori: "Transport",
        nominal: 100000,
        catatan: "bensin",
      },
      {
        id: crypto.randomUUID(),
        tanggal: yesterday,
        jenis: "pengeluaran",
        kategori: "Transport",
        nominal: 10000,
        catatan: "parkir",
      },
      {
        id: crypto.randomUUID(),
        tanggal: today,
        jenis: "pemasukan",
        kategori: "Gaji",
        nominal: 5000000,
        catatan: "gajian masuk",
      },
    ];

    return NextResponse.json({
      success: true,
      transcript: mockTranscript,
      data: mockData,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
