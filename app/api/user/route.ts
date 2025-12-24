import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (error) throw error;

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { billing_cycle_start_day } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("users")
      .update({ billing_cycle_start_day })
      .eq("email", session.user.email)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
