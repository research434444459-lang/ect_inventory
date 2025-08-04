"use client";
import Link from "next/link";

export default function AdminMenu() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="font-bold text-lg mb-2">📢 รายการขอยืมวันนี้</h2>
        <p className="mb-4">มีคำขอยืมทั้งหมด <strong>5 รายการ</strong> ในวันนี้</p>
        <Link href="/admin/requests" className="btn btn-primary w-max">ดูคำขอทั้งหมด</Link>
      </div>
      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="font-bold text-lg mb-2">📦 จัดการคลังอุปกรณ์</h2>
        <p className="mb-4">เพิ่มหรือลบชนิดและจำนวนของอุปกรณ์</p>
        <Link href="/admin/inventory" className="btn btn-success w-max">เข้าสู่หน้าจัดการคลัง</Link>
      </div>
      {/* Card 3 */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="font-bold text-lg mb-2">🔧 จัดการสถานะอุปกรณ์</h2>
        <p className="mb-4">แก้ไขสถานะ เช่น พร้อมใช้งาน / ไม่พร้อมใช้งาน และระบุรอยตำหนิ</p>
        <Link href="/admin/status" className="btn btn-warning w-max">เข้าสู่หน้าจัดการสถานะ</Link>
      </div>
      {/* Card 4 */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="font-bold text-lg mb-2">✅ ลงทะเบียนรับอุปกรณ์</h2>
        <p className="mb-4">อนุมัติหรือปฏิเสธคำขอ และกรอก Serial Number ของอุปกรณ์</p>
        <Link href="/admin/register" className="btn btn-info w-max">ไปยังหน้าลงทะเบียนรับอุปกรณ์</Link>
      </div>
      {/* กลับหน้าหลัก */}
      <div className="col-span-full flex justify-center mt-6">
        <Link href="/" className="btn btn-secondary">กลับหน้าหลัก</Link>
      </div>
    </div>
  );
}
