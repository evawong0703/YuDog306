"use client";

import { useState } from "react";
import { usePantry } from "@/components/context/PantryContext";
import type { Item } from "@/types/item";
import {
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/supabase/pantry";
import { addPendingAction } from "@/lib/offline/pendingActions";

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

function pendingId() {
  return crypto.randomUUID();
}

export default function ItemList({
  items,
  setItems,
  onManageCategories,
}: Props) {
  const {
    categories,
    isOnline,
    refreshPendingActionCount,
  } = usePantry();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const queueUpdate = (item: Item) => {
    addPendingAction({
      id: pendingId(),
      type: "update",
      item,
      createdAt: new Date().toISOString(),
    });
    refreshPendingActionCount();
  };

  const queueCreate = (item: Item) => {
    addPendingAction({
      id: pendingId(),
      type: "create",
      item,
      createdAt: new Date().toISOString(),
    });
    refreshPendingActionCount();
  };

  const queueDelete = (id: string) => {
    addPendingAction({
      id: pendingId(),
      type: "delete",
      itemId: id,
      createdAt: new Date().toISOString(),
    });
    refreshPendingActionCount();
  };

  const handleIncrease = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    const updatedItem = { ...target, qty: target.qty + 1 };

    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    if (!isOnline) {
      queueUpdate(updatedItem);
      return;
    }

    try {
      await updateItem(updatedItem);
    } catch (error) {
      console.error("Failed to update item, saved offline", error);
      queueUpdate(updatedItem);
    }
  };

  const handleDecrease = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target || target.qty <= 0) return;

    const updatedItem = { ...target, qty: target.qty - 1 };

    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    if (!isOnline) {
      queueUpdate(updatedItem);
      return;
    }

    try {
      await updateItem(updatedItem);
    } catch (error) {
      console.error("Failed to update item, saved offline", error);
      queueUpdate(updatedItem);
    }
  };

  const handleAddItem = async (newItem: Item) => {
    setItems((prev) => [newItem, ...prev]);

    if (!isOnline) {
      queueCreate(newItem);
      return;
    }

    try {
      await createItem(newItem);
    } catch (error) {
      console.error("Failed to create item, saved offline", error);
      queueCreate(newItem);
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

    if (!isOnline) {
      queueUpdate(updatedItem);
      return;
    }

    try {
      await updateItem(updatedItem);
    } catch (error) {
      console.error("Failed to edit item, saved offline", error);
      queueUpdate(updatedItem);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const confirmed = window.confirm("確定刪除呢件貨品？");
    if (!confirmed) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

    if (!isOnline) {
      queueDelete(id);
      return;
    }

    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Failed to delete item, saved offline", error);
      queueDelete(id);
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