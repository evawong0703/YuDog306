"use client";

import PageContainer from "@/components/ui/PageContainer";
import { usePantry } from "@/components/context/PantryContext";

export default function ShopPage() {
  const { items, isHydrated } = usePantry();

  if (!isHydrated) {
    return (
      <PageContainer>
        <div className="p-4">
          <h1 className="text-lg font-bold text-[#8b5e3c]">買餸 / 補貨</h1>
          <div className="mt-4 rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
            載入中...
          </div>
        </div>
      </PageContainer>
    );
  }

  const lowStockItems = items.filter((item) => item.qty < item.minQty);
  const warningItems = items.filter((item) => item.qty === item.minQty);
  const shoppingItems = [...lowStockItems, ...warningItems];

  return (
    <PageContainer>
      <div className="p-4">
        <h1 className="text-lg font-bold text-[#8b5e3c]">買餸 / 補貨</h1>
        <p className="mt-1 text-sm text-[#7a5c3c]">
          自動顯示低於或等於最低存量嘅項目
        </p>

        <div className="mt-4 rounded-2xl bg-[#fffaf3] p-4">
          <div className="text-sm font-bold text-[#8b5e3c]">
            需要補貨：{lowStockItems.length}
          </div>
          <div className="mt-1 text-sm font-bold text-yellow-700">
            接近最低：{warningItems.length}
          </div>
        </div>

        <div className="mt-4">
          {shoppingItems.length > 0 ? (
            shoppingItems.map((item) => {
              const isLowStock = item.qty < item.minQty;

              return (
                <div
                  key={item.id}
                  className={`mb-3 rounded-2xl border p-4 shadow-sm ${
                    isLowStock
                      ? "border-red-300 bg-red-50"
                      : "border-yellow-300 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#3d2a1a]">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.categoryName}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    現有：
                    <span
                      className={`ml-1 font-bold ${
                        isLowStock ? "text-red-600" : "text-yellow-700"
                      }`}
                    >
                      {item.qty} {item.unit}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-gray-400">
                    最低補貨量：{item.minQty} {item.unit}
                  </div>

                  <div
                    className={`mt-2 text-sm font-semibold ${
                      isLowStock ? "text-red-600" : "text-yellow-700"
                    }`}
                  >
                    {isLowStock ? "🔴 需要補貨" : "🟡 接近最低存量"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
              目前唔使補貨 🎉
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}