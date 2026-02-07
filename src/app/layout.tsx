import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DGS Hazirlik",
  description: "DGS sinavina hazirlik - Yapay zeka destekli ogrenme platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
