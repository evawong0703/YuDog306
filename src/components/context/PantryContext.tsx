"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Item } from "@/types/item";
import type { Category } from "@/types/category";
import { mockCategories, mockItems } from "@/lib/data/mockData";
import { fetchCategories, fetchItems } from "@/lib/supabase/pantry";
import { supabase } from "@/lib/supabase/client";

type PantryContextType = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isHydrated: boolean;
};

const ITEMS_STORAGE_KEY = "shiba-pantry-items";
const CATEGORIES_STORAGE_KEY = "shiba-pantry-categories";

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const cloudCategories = await fetchCategories();
        console.log("cloudCategories", cloudCategories);

        setCategories(cloudCategories);
        localStorage.setItem(
          CATEGORIES_STORAGE_KEY,
          JSON.stringify(cloudCategories)
        );
      } catch (categoryError) {
        console.error("Failed to load categories from Supabase", categoryError);

        const rawCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (rawCategories) {
          setCategories(JSON.parse(rawCategories) as Category[]);
        }
      }

      try {
        const cloudItems = await fetchItems();
        console.log("cloudItems", cloudItems);

        setItems(cloudItems);
        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(cloudItems));
      } catch (itemError) {
        console.error("Failed to load items from Supabase", itemError);

        const rawItems = localStorage.getItem(ITEMS_STORAGE_KEY);
        if (rawItems) {
          setItems(JSON.parse(rawItems) as Item[]);
        }
      }

      setIsHydrated(true);
    }

    loadData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("pantry-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "items",
        },
        async () => {
          try {
            const latestItems = await fetchItems();
            setItems(latestItems);
            localStorage.setItem(
              ITEMS_STORAGE_KEY,
              JSON.stringify(latestItems)
            );
          } catch (error) {
            console.error("Failed to sync items realtime", error);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        async () => {
          try {
            const latestCategories = await fetchCategories();
            setCategories(latestCategories);
            localStorage.setItem(
              CATEGORIES_STORAGE_KEY,
              JSON.stringify(latestCategories)
            );
          } catch (error) {
            console.error("Failed to sync categories realtime", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save pantry data to localStorage", error);
    }
  }, [categories, items, isHydrated]);

  return (
    <PantryContext.Provider
      value={{
        items,
        setItems,
        categories,
        setCategories,
        isHydrated,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const context = useContext(PantryContext);

  if (!context) {
    throw new Error("usePantry must be used inside PantryProvider");
  }

  return context;
}

