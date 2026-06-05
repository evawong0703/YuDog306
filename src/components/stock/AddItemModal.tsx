"use client";

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { Category } from "@/types/category";
import type { Item } from "@/types/item";

type Props = {
  open: boolean;
  categories?: Category[];
  editingItem?: Item | null;
  onClose: () => void;
  onAdd: (item: Item) => void;
  onEdit: (item: Item) => void;
};

export default function AddItemModal({
  open,
  categories = [],
  editingItem,
  onClose,
  onAdd,
  onEdit,
}: Props) {
  const safeCategories = categories ?? [];
  const firstRealCategory = safeCategories.find((c) => c.id !== "all");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [qty, setQty] = useState("0");
  const [minQty, setMinQty] = useState("0");
  const [unit, setUnit] = useState("");
  const [store, setStore] = useState("");
  const [price, setPrice] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [note, setNote] = useState("");

  const handlers = useSwipeable({
    onSwipedDown: () => {
      onClose();
    },
    trackTouch: true,
  });

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (editingItem) {
      setName(editingItem.name);
      setCategoryId(editingItem.categoryId);
      setQty(String(editingItem.qty));
      setMinQty(String(editingItem.minQty ?? 0));
      setUnit(editingItem.unit ?? "");
      setStore(editingItem.store ?? "");
      setExpireDate(editingItem.expireDate ?? "");
      setPrice(
        editingItem.price != null
          ? String(editingItem.price)
          : editingItem.prices?.[0]?.price
          ? String(editingItem.prices[0].price)
          : ""
      );
      setNote(editingItem.note ?? "");
      return;
    }

    setName("");
    setCategoryId(firstRealCategory?.id ?? "");
    setQty("0");
    setMinQty("0");
    setUnit("");
    setStore("");
    setPrice("");
    setExpireDate("");
    setNote("");
  }, [open, editingItem, firstRealCategory?.id]);

  if (!open) return null;

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("請輸入貨品名稱");
      return;
    }

    const finalCategoryId = categoryId || firstRealCategory?.id || "";

    if (!finalCategoryId) {
      alert("請先新增或選擇一個分類");
      return;
    }

    const selectedCategory = safeCategories.find(
      (c) => c.id === finalCategoryId
    );

    if (!selectedCategory || selectedCategory.id === "all") {
      alert("請選擇有效分類");
      return;
    }

    const parsedPrice = Number(price);
    const finalPrice =
      !Number.isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;

    const prices =
      finalPrice !== null
        ? [
            {
              id: editingItem?.prices?.[0]?.id ?? crypto.randomUUID(),
              price: finalPrice,
              date: new Date().toISOString().slice(0, 10),
            },
          ]
        : editingItem?.prices ?? [];

    const itemPayload: Item = {
      id: editingItem?.id ?? crypto.randomUUID(),
      name: trimmedName,
      categoryId: finalCategoryId,
      categoryName: selectedCategory.name,
      qty: Number(qty) || 0,
      minQty: Number(minQty) || 0,
      unit: unit.trim(),
      store: store.trim(),
      price: finalPrice,
      expireDate: expireDate.trim() || undefined,
      note: note.trim(),
      prices,
      createdAt: editingItem?.createdAt,
      updatedAt: editingItem?.updatedAt,
    };

    if (editingItem) {
      onEdit(itemPayload);
    } else {
      onAdd(itemPayload);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full max-w-[480px] overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          {...handlers}
          onClick={onClose}
          className="mx-auto mb-4 h-2 w-16 cursor-pointer rounded-full bg-gray-200"
        />

        <h2 className="text-center text-lg font-bold text-[#8b5e3c]">
          {editingItem ? "編輯貨品 ✏️" : "新增貨品 🐾"}
        </h2>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              貨品名稱
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：燕麥奶"
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              分類
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            >
              {safeCategories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                數量
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                最低補貨量
              </label>
              <input
                type="number"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              單位
            </label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="例如：盒 / 包 / 樽"
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              購買地點
            </label>
            <input
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="例如：Tesco / Costco / Amazon"
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              價錢 £
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="例如：2.50"
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              到期日
            </label>
            <input
              type="date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              備註
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="可留空"
              className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="mt-5 space-y-2 pb-4">
          <button
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-[#8b5e3c] py-3 font-semibold text-white"
          >
            {editingItem ? "更新 ✓" : "儲存 ✓"}
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-[#e8d4b8] py-3 font-semibold text-gray-600"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}