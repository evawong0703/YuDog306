"use client";

import type { Item } from "@/types/item";

type Props = {
  item: Item;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getExpiryStatus(expireDate?: string) {
  if (!expireDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expireDate);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return {
      text: `❌ 已過期 ${Math.abs(diffDays)} 日`,
      color: "text-red-600",
    };
  }

  if (diffDays <= 7) {
    return {
      text: `🚨 ${diffDays} 日內到期`,
      color: "text-red-600",
    };
  }

  if (diffDays <= 30) {
    return {
      text: `⚠️ ${diffDays} 日後到期`,
      color: "text-yellow-700",
    };
  }

  return null;
}

export default function ItemCard({
  item,
  onIncrease,
  onDecrease,
  onEdit,
  onDelete,
}: Props) {
  const isLowStock = item.qty < item.minQty;
  const isWarningStock =   item.minQty > 0 && item.qty === item.minQty;
  const expiryStatus = getExpiryStatus(item.expireDate);

  return (
    <div
      className={`mb-4 rounded-3xl border p-5 shadow-sm ${
        isLowStock
          ? "border-red-300 bg-red-50"
          : isWarningStock
          ? "border-yellow-300 bg-yellow-50"
          : "border-[#e8d4b8] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#3d2a1a]">
            {item.name}
          </h2>

          <div className="mt-4 text-sm text-gray-500">
            數量：
            <span
              className={`ml-2 text-lg font-bold ${
                isLowStock
                  ? "text-red-600"
                  : isWarningStock
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {item.qty} {item.unit}
            </span>
          </div>

          {isLowStock && (
            <div className="mt-2 text-sm font-semibold text-red-600">
              🔴 需要補貨
            </div>
          )}

          {isWarningStock && (
            <div className="mt-2 text-sm font-semibold text-yellow-700">
              🟡 接近最低存量
            </div>
          )}

          {expiryStatus && (
            <div
              className={`mt-2 text-sm font-semibold ${expiryStatus.color}`}
            >
              {expiryStatus.text}
            </div>
          )}

          <div className="mt-2 text-xs text-gray-400">
            最後更新：
            {formatDate(item.updatedAt ?? item.createdAt)}
          </div>
        </div>

        <div className="text-sm font-semibold text-gray-500">
          {item.categoryName}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(item.id)}
            className="rounded-full bg-gray-100 px-4 py-2 font-semibold text-[#3d2a1a]"
          >
            編輯
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="rounded-full bg-red-100 px-4 py-2 font-semibold text-red-600"
          >
            刪除
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onDecrease(item.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold"
          >
            -
          </button>

          <button
            onClick={() => onIncrease(item.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6b800] text-lg font-bold text-white"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}