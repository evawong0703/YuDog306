import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { webpush } from "@/lib/push/webpush";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("push_subscriptions")
    .select("subscription");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payload = JSON.stringify({
    title: "🐕 YuDOG 306",
    body: "恭喜！Push Notification 已成功！🎉",
    url: "/",
  });

  for (const row of data ?? []) {
    try {
      await webpush.sendNotification(row.subscription, payload);
    } catch (err) {
      console.error(err);
    }
  }

  return NextResponse.json({
    success: true,
    sent: data?.length ?? 0,
  });
}