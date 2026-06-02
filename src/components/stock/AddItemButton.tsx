"use client";

type Props = {
  onClick: () => void;
};

export default function AddItemButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#8b5e3c] text-3xl font-bold text-white shadow-lg"
    >
      +
    </button>
  );
}