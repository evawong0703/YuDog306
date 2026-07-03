import webpush from "web-push";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const pushEmail = process.env.PUSH_EMAIL;

if (!vapidPublicKey || !vapidPrivateKey || !pushEmail) {
  throw new Error("Missing web push environment variables");
}

webpush.setVapidDetails(
  process.env.PUSH_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export { webpush };