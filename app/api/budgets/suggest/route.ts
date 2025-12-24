import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
    );

    // 1. Fetch historical data (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, category, date, type")
      .eq("user_email", session.user.email)
      .eq("type", "expense")
      .gte("date", ninetyDaysAgo.toISOString());

    if (!transactions || transactions.length === 0) {
      // Return defaults if no history
      return NextResponse.json({
        budgets: [
          { category: "Food", amount: 1500000 },
          { category: "Transport", amount: 500000 },
          { category: "Entertainment", amount: 500000 },
          { category: "Bills", amount: 1000000 },
          { category: "Other", amount: 500000 },
        ],
      });
    }

    // 2. Prepare prompt for Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            budgets: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  category: { type: SchemaType.STRING },
                  amount: { type: SchemaType.NUMBER },
                },
                required: ["category", "amount"],
              },
            },
          },
        },
      },
    });

    const prompt = `
      You are a financial advisor. Analyze the user's expense history from the last 90 days and suggest a realistic monthly budget for EACH category found.
      
      Expenses:
      ${JSON.stringify(transactions)}

      Rules:
      1. Calculate average monthly spending for each category.
      2. Suggest a budget slightly higher (e.g. +10%) than the average to be safe, rounded to the nearest 50,000.
      3. If a category appears often, include it.
      4. Return a list of categories and suggested budget amounts.
      5. Amounts should be in IDR (Numeric).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const json = JSON.parse(response.text());

    return NextResponse.json(json);
  } catch (error: any) {
    console.error("Budget Suggest Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
