"use client";

import { usePantry } from "@/components/context/PantryContext";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function EnablePushButton() {
  const { setNotificationEnabled } = usePantry();

  const handleEnablePush = async () => {
    if (!("serviceWorker" in navigator)) {
      alert("呢個瀏覽器唔支援通知");
      return;
    }

    if (!("PushManager" in window)) {
      alert("呢個裝置暫時唔支援 Push Notification");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("你未允許通知");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      alert("Missing VAPID public key");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      alert("通知註冊失敗，請再試");
      return;
    }

    setNotificationEnabled(true);
    localStorage.setItem("notification-enabled", "true");

    alert("通知已開啟 ✅");
  };

  return (
    <button
      onClick={handleEnablePush}
      className="rounded-full bg-[#8b5e3c] px-3 py-1 text-xs font-semibold text-white"
    >
      🔔 開啟通知
    </button>
  );
}