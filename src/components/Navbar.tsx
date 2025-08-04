"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = session?.user?.isAdmin;

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-30">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span role="img" aria-label="camera">📷</span>
          <span>ECT Inventory</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h20M4 14h20M4 21h20" />
          </svg>
        </button>

        {/* Menu */}
        <div className={`flex-col md:flex-row md:flex gap-4 items-center ${open ? "flex" : "hidden"} md:!flex absolute md:static bg-white md:bg-transparent left-0 right-0 top-[56px] md:top-0 shadow-md md:shadow-none z-40 md:z-0`}>
          <Link href="/" className={`py-2 px-3 rounded hover:bg-gray-100 ${pathname === "/" ? "font-semibold text-blue-600" : ""}`}>หน้าแรก</Link>
          <Link href="/#equipment-section" className="py-2 px-3 rounded hover:bg-gray-100">ดูอุปกรณ์</Link>
          {/* ถ้าอยากลิ้งค์ไปฟอร์ม Google */}
          <a
            href="https://docs.google.com/forms/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded hover:bg-gray-100"
          >ขอยืมอุปกรณ์</a>

          {/* ปุ่ม admin เฉพาะแอดมิน */}
          {isAdmin && (
            <Link href="/admin" className={`py-2 px-3 rounded hover:bg-gray-100 ${pathname.startsWith("/admin") ? "font-semibold text-blue-600" : ""}`}>เมนูผู้ดูแล</Link>
          )}

          {/* login/logout */}
          {status === "loading" ? (
            <span className="py-2 px-3 text-gray-500">Loading...</span>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="py-2 px-4 ml-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              ออกจากระบบ
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="py-2 px-4 ml-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              เข้าสู่ระบบผู้ดูแล
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
