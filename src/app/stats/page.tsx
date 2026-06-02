"use client";

import PageContainer from "@/components/ui/PageContainer";
import { usePantry } from "@/components/context/PantryContext";
import type { Item } from "@/types/item";

function getAveragePrice(item: Item) {
  if (!item.prices.length) return null;

  const total = item.prices.reduce((sum, record) => sum + record.price, 0);
  return total / item.prices.length;
}

export default function StatsPage() {
  const { items, isHydrated } = usePantry();

  if (!isHydrated) {
    return (
      <PageContainer>
        <div className="p-4">
          <h1 className="text-lg font-bold text-[#8b5e3c]">統計</h1>
          <div className="mt-4 rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
            載入中...
          </div>
        </div>
      </PageContainer>
    );
  }

  const totalItems = items.length;
  const lowStockCount = items.filter((item) => item.qty < item.minQty).length;
  const warningStockCount = items.filter(
    (item) => item.qty === item.minQty
  ).length;
  const zeroStockCount = items.filter((item) => item.qty === 0).length;

  const itemsWithPrices = items
    .map((item) => ({
      ...item,
      avgPrice: getAveragePrice(item),
    }))
    .filter((item) => item.avgPrice !== null);

  return (
    <PageContainer>
      <div className="p-4">
        <h1 className="text-lg font-bold text-[#8b5e3c]">統計</h1>
        <p className="mt-1 text-sm text-[#7a5c3c]">目前存貨概覽</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#8b5e3c]">
              {totalItems}
            </div>
            <div className="mt-1 text-xs text-gray-500">總貨品</div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">
              {lowStockCount}
            </div>
            <div className="mt-1 text-xs text-gray-500">需要補貨</div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-yellow-700">
              {warningStockCount}
            </div>
            <div className="mt-1 text-xs text-gray-500">接近最低</div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500">
              {zeroStockCount}
            </div>
            <div className="mt-1 text-xs text-gray-500">已清零</div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-bold text-[#8b5e3c]">平均入貨價</h2>

          <div className="mt-3 space-y-3">
            {itemsWithPrices.length > 0 ? (
              itemsWithPrices.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#e8d4b8] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-[#3d2a1a]">
                        {item.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {item.prices.length} 次入貨
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-[#8b5e3c]">
                        £{item.avgPrice!.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">平均價</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
                暫時未有價格紀錄
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}