import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { PantryProvider } from "@/components/context/PantryContext";

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