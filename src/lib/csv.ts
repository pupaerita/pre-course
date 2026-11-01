// ช่องที่ขึ้นต้นด้วยอักขระเหล่านี้ Excel/Sheets อาจตีความเป็นสูตร (CSV injection)
// จึงใส่ ' นำหน้าให้เป็นข้อความธรรมดา
const FORMULA_START = /^[=+\-@\t\r]/;

function escapeCell(value: string): string {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

// BOM นำหน้าเพื่อให้ Excel เปิดภาษาไทยได้ไม่เพี้ยน
export function toCsv(rows: string[][]): string {
  return "﻿" + rows.map((row) => row.map(escapeCell).join(",")).join("\r\n") + "\r\n";
}
