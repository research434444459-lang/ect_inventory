// src/components/EquipmentCard.tsx
import React from "react";

type Props = {
  equipment: { [key: string]: string };
};

export default function EquipmentCard({ equipment }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      {/* ถ้ามีรูป ให้ดึงจาก field 'image' หรือ 'รูปภาพ' */}
      {equipment["รูปภาพ"] ? (
        <img src={equipment["รูปภาพ"]} alt={equipment["ชื่อ"]} className="w-full h-40 object-cover rounded mb-3" />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-5xl">📷</div>
      )}
      <h3 className="text-lg font-bold">{equipment["ชื่อ"]}</h3>
      <div className="text-sm text-gray-600 mb-2">{equipment["Serial number"]}</div>
      <div className="mb-2">
        <span className="font-medium">สถานะ:</span> {equipment["สถานะ"]}
      </div>
      {equipment["หมายเหตุ"] && (
        <div className="text-xs text-gray-500 mb-1">{equipment["หมายเหตุ"]}</div>
      )}
      {/* ปุ่มหรือรายละเอียดเพิ่มเติม */}
    </div>
  );
}
