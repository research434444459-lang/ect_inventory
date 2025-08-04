import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider"; // <--- นำเข้า Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ระบบยืมคืนอุปกรณ์ | ECT Inventory",
  description: "ระบบเช็คอุปกรณ์ยืม-คืนออนไลน์",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className + " bg-gray-50 min-h-screen"}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 pt-8">{children}</main>
          <footer className="mt-12 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ECT Inventory. Powered by Next.js + Google Sheets.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
