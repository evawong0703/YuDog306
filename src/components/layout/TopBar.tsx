export default function TopBar() {
  return (
    <div className="bg-white border-b border-[#e8d4b8] px-4 py-3 flex items-center justify-between">
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

      <div className="text-sm">🔄</div>
    </div>
  );
}