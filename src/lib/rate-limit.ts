// กันคนกดส่งฟอร์มรัว ๆ แบบง่าย — นับในหน่วยความจำของเซิร์ฟเวอร์
// ข้อจำกัด: ถ้าขึ้นเว็บแบบ serverless ตัวนับจะแยกกันแต่ละเครื่อง (กันได้แค่เบื้องต้น)
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // กันตัวนับโตไม่จำกัด
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}
