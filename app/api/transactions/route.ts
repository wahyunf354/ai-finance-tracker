import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  const category = searchParams.get("category") || "all";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const sortBy = searchParams.get("sortBy") || "newest";

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_email", session.user.email);

  // Filters
  if (search) {
    query = query.ilike("description", `%${search}%`);
    // Note: complex OR logic for category search might need rpc or raw filtering if simple OR isnt supported cleanly in chain
    // keeping it simple to description for now or using 'or'
    // query = query.or(`description.ilike.%${search}%,category.ilike.%${search}%`);
  }

  if (type !== "all") {
    query = query.eq("type", type);
  }

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (from) {
    query = query.gte("date", from);
  }

  if (to) {
    query = query.lte("date", to);
  }

  // Sorting
  switch (sortBy) {
    case "oldest":
      query = query.order("date", { ascending: true });
      break;
    case "highest":
      query = query.order("amount", { ascending: false });
      break;
    case "lowest":
      query = query.order("amount", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("date", { ascending: false });
      break;
  }

  // Pagination
  const fromIdx = (page - 1) * limit;
  const toIdx = fromIdx + limit - 1;
  query = query.range(fromIdx, toIdx);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, meta: { total: count, page, limit } });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    date,
    description,
    amount,
    category,
    type,
    items,
    tax,
    discount,
  } = body;

  // Validation — never trust client input
  if (typeof description !== "string" || description.trim() === "") {
    return NextResponse.json(
      { error: "Description is required" },
      { status: 400 }
    );
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return NextResponse.json(
      { error: "Amount must be a number greater than 0" },
      { status: 400 }
    );
  }

  if (typeof date !== "string" || date.trim() === "") {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  if (typeof category !== "string" || category.trim() === "") {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  if (type !== "income" && type !== "expense") {
    return NextResponse.json(
      { error: "Type must be 'income' or 'expense'" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        date,
        description: description.trim(),
        amount: numericAmount,
        category: category.trim(),
        type,
        items: Array.isArray(items) ? items : [],
        tax: Number(tax) || 0,
        discount: Number(discount) || 0,
        user_email: session.user.email,
        source: "manual",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Missing transaction ID" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_email", session.user.email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const session = await auth();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Missing transaction ID" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .eq("user_email", session.user.email)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
