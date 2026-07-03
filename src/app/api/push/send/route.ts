import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { webpush } from "@/lib/push/webpush";

export async function POST(request: Request) {
  const body = await request.json();
    // 加喺呢度
  console.log("ENV SECRET =", process.env.PUSH_API_SECRET);
  console.log("BODY SECRET =", body.secret);
  console.log("MATCH =", process.env.PUSH_API_SECRET === body.secret);

  if (body.secret !== process.env.PUSH_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("push_subscriptions")
    .select("id, subscription");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payload = JSON.stringify({
    title: body.title ?? "306 通知",
    body: body.body ?? "",
    url: body.url ?? "/",
  });

  const results = await Promise.allSettled(
    (data ?? []).map((row) =>
      webpush.sendNotification(row.subscription, payload)
    )
  );

  return NextResponse.json({
    ok: true,
    sent: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
  });
}