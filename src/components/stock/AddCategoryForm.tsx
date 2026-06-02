"use client";

import { useState } from "react";
import { usePantry } from "@/components/context/PantryContext";
import type { Category } from "@/types/category";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/supabase/pantry";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddCategoryForm({ open, onClose }: Props) {
  const { categories, setCategories, items, setItems } = usePantry();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  if (!open) return null;

  const resetForm = () => {
    setName("");
    setEmoji("📦");
    setEditingCategory(null);
  };

  const handleAddCategory = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const exists = categories.some(
      (cat) => cat.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      alert("呢個分類已經存在");
      return;
    }

    try {
      const newCategoryFromDb = await createCategory({
        name: trimmedName,
        emoji: emoji.trim() || "📦",
      });

      const newCategory: Category = {
        id: newCategoryFromDb.id,
        name: newCategoryFromDb.name,
        emoji: newCategoryFromDb.emoji,
      };

      setCategories((prev) => [...prev, newCategory]);
      resetForm();
    } catch (error) {
      console.error("Failed to create category", error);
      alert("新增分類失敗，請再試");
    }
  };

  const handleStartEdit = (category: Category) => {
    if (category.id === "all") {
      alert("「全部」唔可以修改");
      return;
    }

    setEditingCategory(category);
    setName(category.name);
    setEmoji(category.emoji || "📦");
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    const exists = categories.some(
      (cat) =>
        cat.id !== editingCategory.id &&
        cat.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      alert("已有同名分類");
      return;
    }

    try {
      const updatedFromDb = await updateCategory({
        id: editingCategory.id,
        name: trimmedName,
        emoji: emoji.trim() || "📦",
      });

      const updatedCategory: Category = {
        id: updatedFromDb.id,
        name: updatedFromDb.name,
        emoji: updatedFromDb.emoji,
      };

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? updatedCategory : cat
        )
      );

      setItems((prev) =>
        prev.map((item) =>
          item.categoryId === editingCategory.id
            ? { ...item, categoryName: trimmedName }
            : item
        )
      );

      resetForm();
    } catch (error) {
      console.error("Failed to update category", error);
      alert("更新分類失敗，請再試");
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (categoryId === "all") {
      alert("「全部」唔可以刪除");
      return;
    }

    const isUsed = items.some((item) => item.categoryId === categoryId);

    if (isUsed) {
      alert("呢個分類仲有貨品使用中，未可以刪除");
      return;
    }

    const confirmed = window.confirm(`確定刪除分類「${categoryName}」？`);
    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

      if (editingCategory?.id === categoryId) {
        resetForm();
      }
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("刪除分類失敗，請再試");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={() => {
        resetForm();
        onClose();
      }}
    >
      <div
        className="w-full max-w-[480px] rounded-t-3xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

        <h2 className="text-center text-lg font-bold text-[#8b5e3c]">
          管理分類 📂
        </h2>

        <div className="mt-5">
          <div className="text-sm font-bold text-[#8b5e3c]">現有分類</div>

          <div className="mt-3 space-y-2">
            {categories.map((cat) => {
              const usedCount = items.filter(
                (item) => item.categoryId === cat.id
              ).length;

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-2xl border border-[#e8d4b8] bg-[#fffaf3] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{cat.emoji}</div>
                    <div>
                      <div className="font-medium text-[#3d2a1a]">
                        {cat.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {cat.id === "all"
                          ? "系統分類"
                          : `已使用於 ${usedCount} 件貨品`}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      disabled={cat.id === "all"}
                      className={`rounded-full px-3 py-1 text-sm ${
                        cat.id === "all"
                          ? "cursor-not-allowed bg-gray-100 text-gray-300"
                          : "bg-[#f3eadf] text-[#8b5e3c]"
                      }`}
                    >
                      編輯
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      disabled={cat.id === "all"}
                      className={`rounded-full px-3 py-1 text-sm ${
                        cat.id === "all"
                          ? "cursor-not-allowed bg-gray-100 text-gray-300"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-bold text-[#8b5e3c]">
            {editingCategory ? "編輯分類" : "新增分類"}
          </div>

          <div className="mt-3 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                Emoji
              </label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="📦"
                className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                分類名稱
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：零食 / 急凍食品"
                className="w-full rounded-xl border border-[#e8d4b8] px-4 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {editingCategory ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="w-full rounded-2xl bg-[#8b5e3c] py-3 font-semibold text-white"
              >
                更新分類 ✓
              </button>

              <button
                onClick={resetForm}
                className="w-full rounded-2xl border border-[#e8d4b8] py-3 font-semibold text-gray-600"
              >
                取消編輯
              </button>
            </>
          ) : (
            <button
              onClick={handleAddCategory}
              className="w-full rounded-2xl bg-[#8b5e3c] py-3 font-semibold text-white"
            >
              新增分類 ✓
            </button>
          )}

          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="w-full rounded-2xl border border-[#e8d4b8] py-3 font-semibold text-gray-600"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}