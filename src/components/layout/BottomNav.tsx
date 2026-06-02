import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-[#e8d4b8] flex justify-around py-2 text-xs">
      <Link href="/">📦 存貨</Link>
      <Link href="/menu">📅 餐單</Link>
      <Link href="/shop">🛒 買餸</Link>
      <Link href="/stats">📊 統計</Link>
    </div>
  );
}