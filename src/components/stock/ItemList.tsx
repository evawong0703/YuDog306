"use client";

import { useState } from "react";
import { usePantry } from "@/components/context/PantryContext";
import type { Item } from "@/types/item";
import {
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/supabase/pantry";

import ItemCard from "./ItemCard";
import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import AddItemModal from "./AddItemModal";
import AddItemButton from "./AddItemButton";

type Props = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onManageCategories: () => void;
};

export default function ItemList({
  items,
  setItems,
  onManageCategories,
}: Props) {
  const { categories } = usePantry();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleIncrease = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    const updatedItem = { ...target, qty: target.qty + 1 };

    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    try {
      await updateItem(updatedItem);
    } catch (error) {
      console.error("Failed to update item", error);
      alert("同步失敗，請再試");
    }
  };

  const handleDecrease = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target || target.qty <= 0) return;

    const updatedItem = { ...target, qty: target.qty - 1 };

    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    try {
      await updateItem(updatedItem);
    } catch (error) {
      console.error("Failed to update item", error);
      alert("同步失敗，請再試");
    }
  };

  const handleAddItem = async (newItem: Item) => {
    setItems((prev) => [newItem, ...prev]);

    try {
      await createItem(newItem);
    } catch (error) {
      console.error("Failed to create item", error);
      alert("新增失敗，請再試");
    }
  };

  const handleEditClick = (id: string) => {
    const found = items.find((item) => item.id === id) ?? null;
    setEditingItem(found);
    setOpenAddModal(true);
  };

  const handleEditItem = async (updatedItem: Item) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);

    try {
      await updateItem(updatedItem);
    } catch (error) {
      console.error("Failed to edit item", error);
      alert("更新失敗，請再試");
    }
  };

  const handleDeleteItem = async (id: string) => {
    const confirmed = window.confirm("確定刪除呢件貨品？");
    if (!confirmed) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("刪除失敗，請再試");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.categoryId === activeCategory;

    const keyword = searchText.trim().toLowerCase();
    const matchesSearch =
      keyword === "" ||
      item.name.toLowerCase().includes(keyword) ||
      item.categoryName.toLowerCase().includes(keyword) ||
      (item.note ?? "").toLowerCase().includes(keyword);

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="mt-4">
        <SearchBar value={searchText} onChange={setSearchText} />

        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
          onManage={onManageCategories}
        />

        <div className="mt-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onEdit={handleEditClick}
                onDelete={handleDeleteItem}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
              未搵到符合嘅貨品 🐕
            </div>
          )}
        </div>
      </div>

      <AddItemButton
        onClick={() => {
          setEditingItem(null);
          setOpenAddModal(true);
        }}
      />

      <AddItemModal
        open={openAddModal}
        categories={categories}
        editingItem={editingItem}
        onClose={() => {
          setOpenAddModal(false);
          setEditingItem(null);
        }}
        onAdd={handleAddItem}
        onEdit={handleEditItem}
      />
    </>
  );
}