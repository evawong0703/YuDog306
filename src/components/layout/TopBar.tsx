"use client";

import EnablePushButton from "@/components/push/EnablePushButton";
import { usePantry } from "@/components/context/PantryContext";

export default function TopBar() {
  const {
    notificationEnabled,
    isOnline,
    pendingActionCount,
  } = usePantry();

  return (
    <div className="flex items-center justify-between border-b border-[#e8d4b8] bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🐕</div>

        <div>
          <div className="text-sm font-bold text-[#8b5e3c]">
            狗島肉兄
          </div>

          <div className="text-[10px] text-[#b09070]">
            YuDOG 306
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">

        {!notificationEnabled && (
          <EnablePushButton />
        )}

        <div className="text-lg">
          {isOnline ? "🟢" : "🔴"}
        </div>

        {pendingActionCount > 0 && (
          <div className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
            {pendingActionCount}
          </div>
        )}

      </div>
    </div>
  );
}