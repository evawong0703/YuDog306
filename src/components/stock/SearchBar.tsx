"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mt-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜尋貨品…"
        className="w-full rounded-full border border-[#e8d4b8] bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  );
}