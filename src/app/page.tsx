"use client";

import { useEffect, useState } from "react";
import EquipmentCard from "@/components/EquipmentCard";

type Equipment = {
  [key: string]: string; // เช่น { "ชื่อ": "Canon 650D", "สถานะ": "พร้อมใช้งาน", ... }
};

export default function HomePage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [date, setDate] = useState(""); // สำหรับอนาคต: filter ตามวันที่
  const [keyword, setKeyword] = useState("");

  // โหลดข้อมูลอุปกรณ์
  useEffect(() => {
    fetch("/api/equipments")
      .then((res) => res.json())
      .then((data) => setEquipments(data.equipments || []));
  }, []);

  // Filter คำค้นหา
  const filtered = equipments.filter((row) => {
    if (!keyword) return true;
    // หาคำใน "ชื่อ" หรือ "Serial number"
    const keys = ["ชื่อ", "Serial number", "หมายเลขเครื่อง"];
    return keys.some((k) => row[k]?.toLowerCase().includes(keyword.toLowerCase()));
  });

  // อุปกรณ์แนะนำ = 3 ชิ้นแรก
  const recommended = filtered.slice(0, 3);

  return (
    <div className="pt-16 pb-8 min-h-screen bg-gray-50">
      {/* Hero + Search */}
      <div className="bg-red-500 text-3xl text-white p-8 rounded-lg">Hello Tailwind!</div>
      <div className="max-w-2xl mx-auto mt-8 mb-12 bg-white p-6 rounded-lg shadow text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">ระบบยืมคืนอุปกรณ์ภาควิชา</h1>
        <p className="text-gray-600 mb-4">เลือกวันที่และค้นหาอุปกรณ์ที่คุณต้องการยืม</p>
        <form
          className="flex flex-col md:flex-row gap-4 justify-center"
          onSubmit={e => { e.preventDefault(); }}
        >
          <input
            type="date"
            className="border rounded p-2 flex-1"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="ค้นหาอุปกรณ์ เช่น กล้อง, ไมค์"
            className="border rounded p-2 flex-1"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </form>
      </div>

      {/* Section: อุปกรณ์แนะนำ */}
      <section id="equipment-section" className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-4">แนะนำอุปกรณ์ยอดนิยม</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommended.length > 0 ? (
            recommended.map((item, i) => (
              <EquipmentCard key={i} equipment={item} />
            ))
          ) : (
            <div className="text-gray-500 col-span-3">ไม่มีข้อมูลอุปกรณ์</div>
          )}
        </div>
      </section>

      {/* Section: อุปกรณ์ทั้งหมด */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">รายการอุปกรณ์ทั้งหมด ({filtered.length} รายการ)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <EquipmentCard key={i} equipment={item} />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-12">
              ไม่พบอุปกรณ์ที่ค้นหา
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
