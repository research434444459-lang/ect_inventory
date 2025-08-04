import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// อ่านค่า env
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

// GET: ดึงข้อมูลรายการอุปกรณ์
export async function GET(req: NextRequest) {
  try {
    const sheets = await getSheets();

    // ดึงข้อมูลจาก Sheet ชื่อ Equipments คอลัมน์ A ถึง F
    // (ควรมี header row ใน Google Sheet)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Equipments!A1:F",
    });

    const rows = res.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ equipments: [] }); // ไม่มีข้อมูล
    }

    // แปลงเป็น object array (header-driven)
    const [header, ...data] = rows;
    const equipments = data.map((row) =>
      header.reduce((acc, key, idx) => ({ ...acc, [key]: row[idx] || "" }), {})
    );

    return NextResponse.json({ equipments });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
