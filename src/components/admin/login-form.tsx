"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const uid = useId();
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    if (!password) {
      setError("กรอกรหัสผ่านก่อน");
      return;
    }

    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result: { ok: boolean; message?: string } = await res.json().catch(() => ({ ok: false }));
      if (res.ok && result.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(result.message ?? "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง");
    } catch {
      setError("เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง");
    }
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-password`}>รหัสผ่านผู้ดูแล</Label>
        <Input
          id={`${uid}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${uid}-error` : undefined}
        />
        {error && (
          <p id={`${uid}-error`} role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" variant="accent" disabled={sending}>
        {sending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </Button>
    </form>
  );
}
