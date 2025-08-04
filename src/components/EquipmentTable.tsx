import React from "react";

type Equipment = {
  [key: string]: string;
};

type EquipmentTableProps = {
  equipments: Equipment[];
  onEdit?: (item: Equipment) => void;   // Optional: ฟังก์ชันแก้ไข
  onDelete?: (item: Equipment) => void; // Optional: ฟังก์ชันลบ
  columns?: string[];                   // Optional: ระบุคอลัมน์ที่จะแสดง
};

export default function EquipmentTable({
  equipments,
  onEdit,
  onDelete,
  columns,
}: EquipmentTableProps) {
  if (!equipments || equipments.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500 bg-white rounded shadow">
        ไม่มีข้อมูลอุปกรณ์
      </div>
    );
  }

  // ถ้าไม่ส่ง columns จะใช้ header จากรายการแรก
  const headerCols = columns || Object.keys(equipments[0]);

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            {headerCols.map((col) => (
              <th key={col} className="py-2 px-3 border-b font-semibold whitespace-nowrap">
                {col}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="py-2 px-3 border-b">จัดการ</th>
            )}
          </tr>
        </thead>
        <tbody>
          {equipments.map((item, idx) => (
            <tr key={idx} className="hover:bg-blue-50">
              {headerCols.map((col) => (
                <td key={col} className="py-2 px-3 border-b whitespace-nowrap">
                  {item[col] || "-"}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="py-2 px-3 border-b text-center">
                  {onEdit && (
                    <button
                      className="px-2 py-1 mr-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                      onClick={() => onEdit(item)}
                    >
                      แก้ไข
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      onClick={() => onDelete(item)}
                    >
                      ลบ
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
