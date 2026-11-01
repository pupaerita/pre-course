// คุกกี้ล็อกอินแบบเซ็นลายเซ็น (HMAC-SHA256) — ใช้ Web Crypto เพื่อให้ middleware เรียกใช้ได้ด้วย
// รูปแบบโทเคน: v1.<เวลาหมดอายุ(วินาที)>.<ลายเซ็น>
export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

function toBase64Url(buffer: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

// เทียบข้อความโดยใช้เวลาเท่ากันไม่ว่าตรงกี่ตัว (กันการเดาลายเซ็นจากเวลาตอบ)
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ยังไม่ได้ตั้ง ADMIN_SESSION_SECRET");
  const expires = Math.floor(now / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `v1.${expires}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !token) return false; // ไม่มีกุญแจ = ถือว่าไม่ผ่านเสมอ

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const [version, expires, signature] = parts as [string, string, string];

  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 <= now) return false;

  const expected = await sign(`${version}.${expires}`, secret);
  return safeEqual(signature, expected);
}
