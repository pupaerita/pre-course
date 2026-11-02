"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";

type ApiResult = { ok: boolean; id?: string; message?: string; errors?: Record<string, string> };

// ช่องฟอร์ม: ป้ายชื่อ + คำอธิบาย + ข้อความ error ของช่องนั้น
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

// บันทึก/ลบผ่าน API ฝั่ง server — ใช้ร่วมกันทั้งฟอร์มบทความและผลงาน
export function useContentSave({ api, listHref, id }: { api: string; listHref: string; id?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function call(method: "POST" | "PUT" | "DELETE", url: string, payload?: unknown): Promise<ApiResult> {
    setBusy(true);
    setMessage("");
    setNotice("");
    setErrors({});
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: payload === undefined ? undefined : JSON.stringify(payload),
      });
      const result: ApiResult = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !result.ok) {
        setMessage(result.message ?? "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
        setErrors(result.errors ?? {});
        return { ok: false };
      }
      return result;
    } catch {
      setMessage("เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง");
      return { ok: false };
    } finally {
      setBusy(false);
    }
  }

  async function save(payload: unknown) {
    const result = id ? await call("PUT", `${api}/${id}`, payload) : await call("POST", api, payload);
    if (!result.ok) return;
    if (id) {
      setNotice("บันทึกแล้ว");
      router.refresh();
    } else {
      router.replace(listHref);
      router.refresh();
    }
  }

  async function remove() {
    if (!id) return;
    if (!window.confirm("ลบรายการนี้ถาวร? กู้คืนไม่ได้")) return;
    const result = await call("DELETE", `${api}/${id}`);
    if (!result.ok) return;
    router.replace(listHref);
    router.refresh();
  }

  return { busy, message, notice, errors, save, remove };
}
