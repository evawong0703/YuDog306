"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { usePantry } from "@/components/context/PantryContext";
import type { Item } from "@/types/item";

function getAveragePrice(item: Item) {
  if (!item.prices.length) return item.price ?? null;

  const total = item.prices.reduce((sum, record) => sum + record.price, 0);
  return total / item.prices.length;
}

function getMinPrice(item: Item) {
  const prices = item.prices.map((record) => record.price);

  if (item.price != null) {
    prices.push(item.price);
  }

  if (!prices.length) return null;
  return Math.min(...prices);
}

function getMaxPrice(item: Item) {
  const prices = item.prices.map((record) => record.price);

  if (item.price != null) {
    prices.push(item.price);
  }

  if (!prices.length) return null;
  return Math.max(...prices);
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMoney(value: number | null) {
  if (value == null) return "—";
  return `£${value.toFixed(2)}`;
}

export default function StatsItemsPage() {
  const { items, categories, isHydrated } = usePantry();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"value" | "price" | "name">("value");

  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      if (selectedCategory === "all") return true;
      return item.categoryId === selectedCategory;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "price") {
        return (b.price ?? 0) - (a.price ?? 0);
      }

      return (b.price ?? 0) * b.qty - (a.price ?? 0) * a.qty;
    });
  }, [items, selectedCategory, sortBy]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedItemId) ?? null;

  const totalValue = filteredItems.reduce((sum, item) => {
    if (item.price == null) return sum;
    return sum + item.price * item.qty;
  }, 0);

  const averageItemPrice =
    filteredItems.length > 0
      ? filteredItems.reduce((sum, item) => sum + (item.price ?? 0), 0) /
        filteredItems.length
      : 0;

  if (!isHydrated) {
    return (
      <PageContainer>
        <div className="p-4">
          <h1 className="text-lg font-bold text-[#8b5e3c]">貨品分析</h1>
          <div className="mt-4 rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
            載入中...
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-4">
        <Link href="/stats" className="text-sm font-semibold text-[#8b5e3c]">
          ← 返回統計
        </Link>

        <h1 className="mt-3 text-lg font-bold text-[#8b5e3c]">貨品分析</h1>
        <p className="mt-1 text-sm text-[#7a5c3c]">
          按分類、價錢同存貨總值查看明細
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#8b5e3c]">
              {filteredItems.length}
            </div>
            <div className="mt-1 text-xs text-gray-500">貨品數量</div>
          </div>

          <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#8b5e3c]">
              £{totalValue.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-500">篩選後總值</div>
          </div>

          <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#8b5e3c]">
              £{averageItemPrice.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-500">平均單價</div>
          </div>

          <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#8b5e3c]">
              {new Set(filteredItems.map((item) => item.store).filter(Boolean))
                .size || 0}
            </div>
            <div className="mt-1 text-xs text-gray-500">購買地點數</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedItemId(null);
            }}
            className="box-border w-full rounded-2xl border border-[#e8d4b8] bg-white px-4 py-3 text-sm font-semibold text-[#3d2a1a] outline-none"
          >
            <option value="all">全部分類</option>
            {categories
              .filter((cat) => cat.id !== "all")
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="box-border w-full rounded-2xl border border-[#e8d4b8] bg-white px-4 py-3 text-sm font-semibold text-[#3d2a1a] outline-none"
          >
            <option value="value">存貨總值排序</option>
            <option value="price">單價排序</option>
            <option value="name">名稱排序</option>
          </select>
        </div>

        <div className="mt-5 space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const itemValue = (item.price ?? 0) * item.qty;
              const isOpen = selectedItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#e8d4b8] bg-white p-4 shadow-sm"
                >
                  <button
                    onClick={() =>
                      setSelectedItemId((prev) =>
                        prev === item.id ? null : item.id
                      )
                    }
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-[#3d2a1a]">
                          {item.name}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          {item.categoryName}
                        </div>

                        {item.store && (
                          <div className="mt-1 text-xs text-gray-400">
                            購自：{item.store}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-[#8b5e3c]">
                          {formatMoney(item.price ?? null)}
                        </div>
                        <div className="text-xs text-gray-400">
                          總值 £{itemValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 border-t border-[#f0dfc9] pt-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-[#fff8ef] p-3">
                          <div className="text-xs text-gray-400">現有數量</div>
                          <div className="mt-1 font-bold text-[#3d2a1a]">
                            {item.qty} {item.unit}
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#fff8ef] p-3">
                          <div className="text-xs text-gray-400">最低補貨量</div>
                          <div className="mt-1 font-bold text-[#3d2a1a]">
                            {item.minQty} {item.unit}
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#fff8ef] p-3">
                          <div className="text-xs text-gray-400">平均價</div>
                          <div className="mt-1 font-bold text-[#3d2a1a]">
                            {formatMoney(getAveragePrice(item))}
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#fff8ef] p-3">
                          <div className="text-xs text-gray-400">存貨總值</div>
                          <div className="mt-1 font-bold text-[#3d2a1a]">
                            £{itemValue.toFixed(2)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#fff8ef] p-3">
                          <div className="text-xs text-gray-400">最低價</div>
                          <div className="mt-1 font-bold text-[#3d2a1a]">
                            {formatMoney(getMinPrice(item))}
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#fff8ef] p-3">
                          <div className="text-xs text-gray-400">最高價</div>
                          <div className="mt-1 font-bold text-[#3d2a1a]">
                            {formatMoney(getMaxPrice(item))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1 text-sm text-gray-500">
                        <div>到期日：{formatDate(item.expireDate)}</div>
                        <div>購買地點：{item.store || "—"}</div>
                        <div>備註：{item.note || "—"}</div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-bold text-[#8b5e3c]">
                          入貨紀錄
                        </div>

                        <div className="mt-2 space-y-2">
                          {item.prices.length > 0 ? (
                            item.prices.map((record) => (
                              <div
                                key={record.id}
                                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm"
                              >
                                <span className="text-gray-500">
                                  {formatDate(record.date)}
                                </span>
                                <span className="font-bold text-[#8b5e3c]">
                                  £{record.price.toFixed(2)}
                                </span>
                              </div>
                            ))
                          ) : item.price != null ? (
                            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                              <span className="text-gray-500">目前價格</span>
                              <span className="font-bold text-[#8b5e3c]">
                                £{item.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-[#e8d4b8] p-3 text-center text-sm text-gray-400">
                              暫時未有價格紀錄
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
              暫時未有貨品
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}