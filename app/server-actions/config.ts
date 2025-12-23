"use server";

import { createClient } from "@supabase/supabase-js";

export async function getAppConfig() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("app_configs")
      .select("key, value");

    if (error) throw error;

    const config: Record<string, string> = {};
    if (data) {
      data.forEach((item) => {
        config[item.key] = item.value;
      });
    }

    return { success: true, config };
  } catch (error) {
    console.error("Config Action Error:", error);
    return { success: false, error: "Failed to fetch config" };
  }
}
