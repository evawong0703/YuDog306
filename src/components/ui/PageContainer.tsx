import { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#f9f2e7] pb-20">
      {children}
    </div>
  );
}