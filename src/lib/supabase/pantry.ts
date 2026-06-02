import { supabase } from "./client";
import type { Item } from "@/types/item";
import type { Category } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, emoji")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return [
    {
      id: "all",
      name: "全部",
      emoji: "🐾",
    },
    ...(data ?? []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      emoji: cat.emoji,
    })),
  ];
}

export async function fetchItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select(`
      id,
      name,
      category_id,
      qty,
      min_qty,
      unit,
      note,
      store,
      expire_month,
      prices,
      created_at,
      updated_at,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? "",
    qty: row.qty,
    minQty: row.min_qty,
    unit: row.unit ?? "",
    note: row.note ?? "",
    store: row.store ?? "",
    expireMonth: row.expire_month ?? "",
    prices: row.prices ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createCategory(input: {
  name: string;
  emoji: string;
}) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      emoji: input.emoji,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCategory(input: {
  id: string;
  name: string;
  emoji: string;
}) {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: input.name,
      emoji: input.emoji,
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function createItem(item: Item) {
  const { error } = await supabase
    .from("items")
    .insert({
      id: item.id,
      name: item.name,
      category_id: item.categoryId,
      qty: item.qty,
      min_qty: item.minQty,
      unit: item.unit,
      note: item.note ?? null,
      store: item.store ?? null,
      expire_month: item.expireMonth ?? null,
      prices: item.prices ?? [],
    });

  if (error) throw error;
}

export async function updateItem(item: Item) {
  const { error } = await supabase
    .from("items")
    .update({
      name: item.name,
      category_id: item.categoryId,
      qty: item.qty,
      min_qty: item.minQty,
      unit: item.unit,
      note: item.note ?? null,
      store: item.store ?? null,
      expire_month: item.expireMonth ?? null,
      prices: item.prices ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id);

  if (error) throw error;
}

export async function deleteItem(id: string) {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}