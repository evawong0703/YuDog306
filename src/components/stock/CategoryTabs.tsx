"use client";

import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
  onManage: () => void;
};

export default function CategoryTabs({
  categories,
  active,
  onChange,
  onManage,
}: Props) {
  return (
    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${
            active === cat.id
              ? "bg-[#e6b800] text-white"
              : "border border-gray-200 bg-white text-gray-600"
          }`}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}

      <button
        onClick={onManage}
        className="whitespace-nowrap rounded-full border border-dashed border-[#d8c4a8] bg-[#fffaf3] px-3 py-1 text-sm font-medium text-[#8b5e3c]"
      >
        ⚙️ 管理
      </button>
    </div>
  );
}