import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// ENV config
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "";

// Helper: auth และสร้าง sheet client
async function getSheets() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentials) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON env");

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// GET: ดึงข้อมูลรายการยืม-คืนทั้งหมด
export async function GET(req: NextRequest) {
  try {
    const sheets = await getSheets();

    // เปลี่ยนชื่อ sheet, range ตามจริง เช่น "BorrowRequests!A1:AZ"
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "BorrowRequests!A1:AZ", // AZ รองรับ column เยอะ
    });

    const rows = res.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ requests: [] }); // ไม่มีข้อมูล
    }

    // แปลงเป็น object array (header-driven)
    const [header, ...data] = rows;
    const requests = data.map((row) =>
      header.reduce((acc, key, idx) => ({ ...acc, [key]: row[idx] || "" }), {})
    );

    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
