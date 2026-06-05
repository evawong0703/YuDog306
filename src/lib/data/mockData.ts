import type { Category } from "@/types/category";
import type { Item } from "@/types/item";

export const mockCategories: Category[] = [
  { id: "all", name: "全部", emoji: "🐾" },
  { id: "dry", name: "乾糧/罐頭", emoji: "🥫" },
  { id: "home", name: "家居用品", emoji: "🏠" },
  { id: "clean", name: "清潔用品", emoji: "🧹" },
  { id: "care", name: "衛生用品", emoji: "🧴" },
];

export const mockItems: Item[] = [
  {
    id: "1",
    name: "Oat Milk",
    categoryId: "dry",
    categoryName: "乾糧/罐頭",
    qty: 2,
    minQty: 2,
    unit: "盒",
    expireDate: "2026-06-30",
    note: "早餐用",
    prices: [{ id: "p1", price: 1.8, date: "2026-04" }],
  },
  {
    id: "2",
    name: "Toilet Paper",
    categoryId: "home",
    categoryName: "家居用品",
    qty: 6,
    minQty: 4,
    unit: "卷",
    prices: [{ id: "p2", price: 4.5, date: "2026-04" }],
  },
  {
    id: "3",
    name: "Fairy Liquid",
    categoryId: "clean",
    categoryName: "清潔用品",
    qty: 1,
    minQty: 1,
    unit: "樽",
    prices: [{ id: "p3", price: 2.79, date: "2026-04" }],
  },
];