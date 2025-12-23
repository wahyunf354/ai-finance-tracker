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
        created_at: new Date().toISOString(),
        date: today,
        type: "expense",
        category: "Makanan",
        amount: 25000,
        description: "beli kopi",
      },
      {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        date: today,
        type: "expense",
        category: "Makanan",
        amount: 40000,
        description: "makan siang",
      },
      {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        date: yesterday,
        type: "expense",
        category: "Transport",
        amount: 100000,
        description: "bensin",
      },
      {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        date: yesterday,
        type: "expense",
        category: "Transport",
        amount: 10000,
        description: "parkir",
      },
      {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        date: today,
        type: "income",
        category: "Gaji",
        amount: 5000000,
        description: "gajian masuk",
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
