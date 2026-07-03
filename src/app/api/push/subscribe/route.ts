import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const subscription = await request.json();

  if (!subscription?.endpoint) {
    return NextResponse.json(
      { error: "Missing subscription endpoint" },
      { status: 400 }
    );
  }

  const { error } = await supabaseServer.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      subscription,
    },
    {
      onConflict: "endpoint",
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}