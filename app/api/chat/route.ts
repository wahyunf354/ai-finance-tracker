import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  let lang = "id";
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string;
    const file = formData.get("file") as File | null;
    lang = (formData.get("lang") as string) || "id";

    if (!text && !file) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // 1. Check Session and Identify Source
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let source: "text" | "audio" | "image" = "text";
    if (file) {
      source = file.type.startsWith("image/") ? "image" : "audio";
    }

    // 2. Initialize Supabase and Check Premium Limits
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
    );

    // Fetch dynamic limits from database
    const { data: configData } = await supabase
      .from("app_configs")
      .select("key, value");

    const limits = {
      image: 3, // default fallback
      audio: 10, // default fallback
    };

    if (configData) {
      const imageLimit = configData.find(
        (c) => c.key === "free_image_limit"
      )?.value;
      const voiceLimit = configData.find(
        (c) => c.key === "free_voice_limit"
      )?.value;
      if (imageLimit) limits.image = parseInt(imageLimit);
      if (voiceLimit) limits.audio = parseInt(voiceLimit);
    }

    const { data: userData } = await supabase
      .from("users")
      .select("is_premium")
      .eq("email", session.user.email)
      .single();

    if (!userData?.is_premium) {
      const today = new Date().toISOString().split("T")[0];

      if (source === "image") {
        const { count } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("user_email", session.user.email)
          .eq("source", "image")
          .eq("date", today);

        if (count !== null && count >= limits.image) {
          const errorMsg =
            lang === "id"
              ? `Batas harian scan struk telah tercapai (${limits.image}/${limits.image}). Upgrade ke Premium untuk scan tanpa batas!`
              : `Daily receipt scanning limit reached (${limits.image}/${limits.image}). Upgrade to Premium for unlimited scans!`;
          return NextResponse.json(
            { error: errorMsg, isLimitReached: true },
            { status: 403 }
          );
        }
      } else if (source === "audio") {
        const { count } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("user_email", session.user.email)
          .eq("source", "audio")
          .eq("date", today);

        if (count !== null && count >= limits.audio) {
          const errorMsg =
            lang === "id"
              ? `Batas harian input suara telah tercapai (${limits.audio}/${limits.audio}). Upgrade ke Premium untuk input suara tanpa batas!`
              : `Daily voice input limit reached (${limits.audio}/${limits.audio}). Upgrade to Premium for unlimited voice recording!`;
          return NextResponse.json(
            { error: errorMsg, isLimitReached: true },
            { status: 403 }
          );
        }
      }
    }

    // 3. Prepare Gemini Model and Content
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

    const prompt = `
      You are an AI financial assistant named Finflow. 
      Analyze the provided input (audio, text, or image of a receipt).
      
      1. If the input is an image of a receipt, perform OCR to extract the total amount, merchant name/description, date, and items.
      2. If the input is audio/text, transcribe or use the text directly.
      3. Transcribe the input verbatim in the "transcription" field.
      4. Extract transaction details (date, description, amount, category, type).
      
      IMPORTANT: Amount Format Conversion Rules (Indonesian Number Formats):
      - "k", "rb", or "ribu" means thousand (1,000). Examples: "10k" = 10000, "5rb" = 5000, "3 ribu" = 3000
      - "jt" or "juta" means million (1,000,000). Examples: "10jt" = 10000000, "5 juta" = 5000000
      - Always convert these formats to the actual numeric value in the "amount" field
      
      Date Handling:
      - If the date is not specified, use today's date: ${
        new Date().toISOString().split("T")[0]
      }.
      - Convert any mentioned date to YYYY-MM-DD format.

      Category Guidelines:
      - Food: Restaurants, groceries, coffee, snacks.
      - Transport: Taxi, fuel, train, parking.
      - Salary: Income from work.
      - Bills: Electricity, water, internet, rent.
      - Entertainment: Movies, games, hobbies.
      - Other: Anything else.
    `;

    const parts: Array<
      { text: string } | { inlineData: { data: string; mimeType: string } }
    > = [{ text: prompt }];

    if (text) {
      parts.push({ text: `Input text: "${text}"` });
    }

    if (file) {
      console.log(`Processing ${file.type} file:`, file.name);
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      parts.push({
        inlineData: {
          data: base64Data,
          mimeType:
            file.type ||
            (file.type && file.type.startsWith("image/")
              ? "image/jpeg"
              : "audio/mp3"),
        },
      });
    }

    // 4. Generate Content (Only if validation passed)
    console.log("Sending request to Gemini...");
    const result = await model.generateContent(parts);
    const response = await result.response;
    const jsonString = response.text();

    console.log("Gemini response:", jsonString);

    if (!jsonString) {
      throw new Error("Failed to get response from Gemini");
    }

    const parsedResult = JSON.parse(jsonString);
    const { transcription, ...transactionData } = parsedResult;

    // 5. Insert into Supabase
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          ...transactionData,
          user_email: session.user.email,
          source,
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
    let errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    // Handle Google API Quota/Rate Limit Errors
    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota")
    ) {
      errorMessage =
        lang === "id"
          ? "Layanan AI sedang sibuk atau limit kuota tercapai. Silakan coba lagi nanti."
          : "AI service is busy or quota exceeded. Please try again later.";
      return NextResponse.json({ error: errorMessage }, { status: 429 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
