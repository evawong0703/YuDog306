"use client";

import { useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { usePantry } from "@/components/context/PantryContext";
import type { Item } from "@/types/item";

type ExpiryPanel = "expired" | "due7" | "due30" | null;

function getAveragePrice(item: Item) {
  if (!item.prices.length) return null;

  const total = item.prices.reduce((sum, record) => sum + record.price, 0);
  return total / item.prices.length;
}

function getDaysUntilExpiry(expireDate?: string) {
  if (!expireDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expireDate);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ExpiryDetailList({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  if (!items.length) {
    return (
      <div className="mt-3 rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-6 text-center text-sm text-gray-400">
        暫時沒有項目
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <h2 className="text-sm font-bold text-[#8b5e3c]">{title}</h2>

      {items.map((item) => {
        const days = getDaysUntilExpiry(item.expireDate);

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[#e8d4b8] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-[#3d2a1a]">{item.name}</div>
                <div className="mt-1 text-xs text-gray-400">
                  到期日：{formatDate(item.expireDate)}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  現有：{item.qty} {item.unit}
                </div>
              </div>

              <div className="text-right text-sm font-bold">
                {days != null && days < 0 && (
                  <span className="text-red-600">
                    過期 {Math.abs(days)} 日
                  </span>
                )}

                {days != null && days >= 0 && (
                  <span
                    className={
                      days <= 7 ? "text-red-600" : "text-yellow-700"
                    }
                  >
                    仲有 {days} 日
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const { items, isHydrated } = usePantry();
  const [activePanel, setActivePanel] = useState<ExpiryPanel>(null);

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

  const expiredItems = items.filter((item) => {
    const days = getDaysUntilExpiry(item.expireDate);
    return days !== null && days < 0;
  });

  const due7Items = items.filter((item) => {
    const days = getDaysUntilExpiry(item.expireDate);
    return days !== null && days >= 0 && days <= 7;
  });

  const due30Items = items.filter((item) => {
    const days = getDaysUntilExpiry(item.expireDate);
    return days !== null && days > 7 && days <= 30;
  });

  const totalStockValue = items.reduce((sum, item) => {
    if (item.price == null) return sum;
    return sum + item.price * item.qty;
  }, 0);

  const itemsWithPrices = items
    .map((item) => ({
      ...item,
      avgPrice: getAveragePrice(item),
    }))
    .filter((item) => item.avgPrice !== null);

  const togglePanel = (panel: ExpiryPanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

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

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => togglePanel("expired")}
            className={`rounded-2xl border p-4 text-center shadow-sm ${
              expiredItems.length > 0
                ? activePanel === "expired"
                  ? "border-red-400 bg-red-100"
                  : "border-red-200 bg-red-50"
                : activePanel === "expired"
                ? "border-[#c89d6f] bg-[#fff8ef]"
                : "border-[#e8d4b8] bg-white"
            }`}
          >
            <div
              className={`text-3xl font-bold ${
                expiredItems.length > 0 ? "text-red-600" : "text-[#8b5e3c]"
              }`}
            >
              {expiredItems.length}
            </div>
            <div className="mt-1 text-xs text-gray-500">已過期</div>
          </button>

          <button
            onClick={() => togglePanel("due7")}
            className={`rounded-2xl border p-4 text-center shadow-sm ${
              due7Items.length > 0
                ? activePanel === "due7"
                  ? "border-red-400 bg-red-100"
                  : "border-red-200 bg-red-50"
                : activePanel === "due7"
                ? "border-[#c89d6f] bg-[#fff8ef]"
                : "border-[#e8d4b8] bg-white"
            }`}
          >
            <div
              className={`text-3xl font-bold ${
                due7Items.length > 0 ? "text-red-600" : "text-[#8b5e3c]"
              }`}
            >
              {due7Items.length}
            </div>
            <div className="mt-1 text-xs text-gray-500">7日內到期</div>
          </button>

          <button
            onClick={() => togglePanel("due30")}
            className={`rounded-2xl border p-4 text-center shadow-sm ${
              activePanel === "due30"
                ? "border-yellow-400 bg-yellow-100"
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            <div className="text-3xl font-bold text-yellow-700">
              {due30Items.length}
            </div>
            <div className="mt-1 text-xs text-gray-500">30日內到期</div>
          </button>

          <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#8b5e3c]">
              £{totalStockValue.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-500">存貨總值</div>
          </div>
        </div>

        {activePanel === "expired" && (
          <ExpiryDetailList title="🚨 已過期" items={expiredItems} />
        )}

        {activePanel === "due7" && (
          <ExpiryDetailList title="🚨 7日內到期" items={due7Items} />
        )}

        {activePanel === "due30" && (
          <ExpiryDetailList title="⚠️ 30日內到期" items={due30Items} />
        )}

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