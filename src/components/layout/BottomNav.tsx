import Link from "next/link";

export default function BottomNav() {
  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        mx-auto
        max-w-[480px]
        border-t
        border-[#e8d4b8]
        bg-white
        pb-[max(env(safe-area-inset-bottom),12px)]
        pt-3
        shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
      "
    >
      <div className="flex justify-around text-sm font-medium text-[#6b7280]">
        <Link href="/" className="flex flex-col items-center gap-1">
          <span className="text-lg">📦</span>
          <span>存貨</span>
        </Link>

        <Link href="/menu" className="flex flex-col items-center gap-1">
          <span className="text-lg">📅</span>
          <span>餐單</span>
        </Link>

        <Link href="/shop" className="flex flex-col items-center gap-1">
          <span className="text-lg">🛒</span>
          <span>買餸</span>
        </Link>

        <Link href="/stats" className="flex flex-col items-center gap-1">
          <span className="text-lg">📊</span>
          <span>統計</span>
        </Link>
      </div>
    </div>
  );
}