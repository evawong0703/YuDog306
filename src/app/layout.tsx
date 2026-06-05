import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { PantryProvider } from "@/components/context/PantryContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "306 Pantry",
  description: "Nana Pantry",
  applicationName: "306 Pantry",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-HK">
      <body suppressHydrationWarning>
        <PantryProvider>
          <TopBar />
          {children}
          <BottomNav />
        </PantryProvider>
      </body>
    </html>
  );
}