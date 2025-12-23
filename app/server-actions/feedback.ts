"use server";

import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

export async function submitFeedback(formData: FormData) {
  const session = await auth();
  const message = formData.get("message") as string;
  const rating = formData.get("rating") as string; // Optional, value 1-5

  if (!message || message.trim().length === 0) {
    return { error: "Message is required" };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("feedback").insert([
    {
      user_email: session?.user?.email || "anonymous",
      message: message,
      rating: rating ? parseInt(rating) : null,
    },
  ]);

  if (error) {
    console.error("Feedback submit error:", error);
    return { error: "Failed to submit feedback" };
  }

  return { success: true };
}
