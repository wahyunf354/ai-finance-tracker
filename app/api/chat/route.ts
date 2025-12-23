import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string;
    const file = formData.get("file") as File | null;

    if (!text && !file) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // 1. Prepare Gemini Model
    const modelName = "gemini-flash-latest";
    console.log("Initializing Gemini Model:", modelName);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            date: { type: SchemaType.STRING, description: "YYYY-MM-DD" },
            description: { type: SchemaType.STRING },
            amount: { type: SchemaType.NUMBER },
            category: {
              type: SchemaType.STRING,
              description:
                "One of: Food, Transport, Salary, Bills, Entertainment, Other",
            },
            type: { type: SchemaType.STRING, description: "income or expense" },
            transcription: {
              type: SchemaType.STRING,
              description:
                "The verbatim transcription of the input text or audio",
            },
          },
          required: [
            "date",
            "description",
            "amount",
            "category",
            "type",
            "transcription",
          ],
        },
      },
    });

    // 2. Prepare Prompt and Content
    const prompt = `
      You are an AI financial assistant. 
      Analyze the provided input (audio or text).
      1. Transcribe the input verbatim.
      2. Extract transaction details (date, description, amount, category, type).
      
      IMPORTANT: Amount Format Conversion Rules (Indonesian Number Formats):
      - "k", "rb", or "ribu" means thousand (1,000). Examples: "10k" = 10000, "5rb" = 5000, "3 ribu" = 3000, "5ribu" = 5000
      - "jt" or "juta" means million (1,000,000). Examples: "10jt" = 10000000, "5 juta" = 5000000, "2jt" = 2000000
      - Always convert these formats to the actual numeric value in the "amount" field
      - Examples: "beli makan 50rb" → amount: 50000, "gaji 5jt" → amount: 5000000, "transport 10k" → amount: 10000
      - If multiple formats are used (e.g., "10 ribu 500"), combine them: 10000 + 500 = 10500
      
      Date Handling:
      - If the date is not specified, use today's date: ${
        new Date().toISOString().split("T")[0]
      }.
      - If date is mentioned (e.g., "kemarin", "yesterday", "hari ini", "today", specific date), extract and convert to YYYY-MM-DD format.
    `;

    const parts: Array<
      { text: string } | { inlineData: { data: string; mimeType: string } }
    > = [{ text: prompt }];

    if (text) {
      parts.push({ text: `Input text: "${text}"` });
    }

    if (file) {
      console.log("Processing audio file:", file.name);
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.type || "audio/mp3", // Fallback mimeType if missing
        },
      });
    }

    // 3. Generate Content
    console.log("Sending request to Gemini...");
    const result = await model.generateContent(parts);
    const response = await result.response;
    const jsonString = response.text();

    console.log("Gemini response:", jsonString);

    if (!jsonString) {
      throw new Error("Failed to get response from Gemini");
    }

    const parsedResult = JSON.parse(jsonString);

    // Separate transcription from transaction data
    const { transcription, ...transactionData } = parsedResult;

    console.log("Parsed transaction:", transactionData);

    // 3. Insert into Supabase
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Supabase Client (Standard)
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          ...transactionData,
          user_email: session.user.email,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transcribedText: transcription,
      data: data[0],
    });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
