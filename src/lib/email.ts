import { Resend } from "resend";
import { site } from "@/data/site";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ส่งอีเมลขอบคุณ — ถ้าไม่มี RESEND_API_KEY หรือส่งไม่สำเร็จ จะไม่ทำให้การสมัครล้มเหลว
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] ยังไม่ได้ตั้ง RESEND_API_KEY — ข้ามการส่งอีเมลขอบคุณ");
    return false;
  }

  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const safeName = escapeHtml(name);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `ขอบคุณที่สมัครรับบทความจาก${site.name}`,
      text: `สวัสดี ${name}\n\nขอบคุณที่สมัครรับบทความ เราจะส่งบทความใหม่ให้ทางอีเมลนี้เมื่อมีเท่านั้น\nถ้าไม่ต้องการรับอีกแล้ว ตอบกลับอีเมลนี้ได้เลย\n\n${site.fullName}`,
      html: `<p>สวัสดี ${safeName}</p><p>ขอบคุณที่สมัครรับบทความ เราจะส่งบทความใหม่ให้ทางอีเมลนี้เมื่อมีเท่านั้น<br>ถ้าไม่ต้องการรับอีกแล้ว ตอบกลับอีเมลนี้ได้เลย</p><p>${escapeHtml(site.fullName)}</p>`,
    });
    if (error) {
      console.error("[email] ส่งไม่สำเร็จ:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] ส่งไม่สำเร็จ:", err instanceof Error ? err.message : err);
    return false;
  }
}
