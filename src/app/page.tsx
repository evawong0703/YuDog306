"use client";

import { useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import ItemList from "@/components/stock/ItemList";
import AddCategoryForm from "@/components/stock/AddCategoryForm";
import { usePantry } from "@/components/context/PantryContext";

export default function HomePage() {
  const { items, setItems, isHydrated } = usePantry();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  return (
    <PageContainer>
      <div className="p-4">
        <h1 className="text-lg font-bold text-[#8b5e3c]">存貨列表</h1>

        {!isHydrated ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#e8d4b8] bg-white p-8 text-center text-sm text-gray-400">
            載入中...
          </div>
        ) : (
          <>
            <ItemList
              items={items}
              setItems={setItems}
              onManageCategories={() => setOpenCategoryModal(true)}
            />

            <AddCategoryForm
              open={openCategoryModal}
              onClose={() => setOpenCategoryModal(false)}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}