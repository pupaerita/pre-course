"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribeSchema, type SubscribeField } from "@/lib/validators";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<SubscribeField, string>>;
type Status = "idle" | "sending" | "done";

type Props = {
  // "onAccent" ใช้เมื่อวางบนพื้นสีน้ำเงิน
  tone?: "light" | "onAccent";
};

export function SubscribeForm({ tone = "light" }: Props) {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");
  const [formError, setFormError] = useState("");
  const onAccent = tone === "onAccent";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = subscribeSchema.safeParse({
      name: data.get("name") ?? "",
      email: data.get("email") ?? "",
      consent: data.get("consent") === "on",
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as SubscribeField;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: data.get("website") ?? "" }),
      });
      const result: { ok: boolean; message?: string; fields?: Errors } = await res
        .json()
        .catch(() => ({ ok: false }));

      if (res.ok && result.ok) {
        setSentName(parsed.data.name);
        setStatus("done");
        return;
      }
      if (result.fields) setErrors(result.fields);
      setFormError(result.message ?? "ส่งไม่สำเร็จ ลองใหม่อีกครั้งในอีกสักครู่");
    } catch {
      setFormError("เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง");
    }
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div role="status" className={cn("text-lg", onAccent ? "text-white" : "text-ink")}>
        <p className="font-medium">ขอบคุณ {sentName} เราบันทึกอีเมลของคุณแล้ว</p>
        <p className={cn("mt-2 text-sm", onAccent ? "text-white/80" : "text-muted")}>
          บทความใหม่จะส่งไปที่อีเมลนี้เมื่อมีเท่านั้น
        </p>
      </div>
    );
  }

  const labelTone = onAccent ? "text-white" : "text-ink";
  const errorTone = onAccent ? "text-white underline decoration-white/60" : "text-red-700";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* ช่องล่อบอต: คนจริงมองไม่เห็นและเลื่อนโฟกัสไปไม่ถึง */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          อย่ากรอกช่องนี้
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-name`} className={labelTone}>
            ชื่อ
          </Label>
          <Input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            placeholder="ชื่อที่ให้เราเรียก"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className={cn("text-sm", errorTone)}>
              {errors.name}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-email`} className={labelTone}>
            อีเมล
          </Label>
          <Input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} className={cn("text-sm", errorTone)}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={cn("flex items-start gap-3 text-sm", labelTone)}>
          <input
            type="checkbox"
            name="consent"
            className="mt-1.5 h-4 w-4 shrink-0 accent-ink"
            aria-invalid={Boolean(errors.consent)}
          />
          <span>ยินยอมให้ส่งบทความใหม่และข่าวสารทางอีเมล ยกเลิกได้ทุกเมื่อ</span>
        </label>
        {errors.consent && <p className={cn("text-sm", errorTone)}>{errors.consent}</p>}
      </div>

      {formError && (
        <p role="alert" className={cn("text-sm font-medium", errorTone)}>
          {formError}
        </p>
      )}

      <Button
        type="submit"
        variant={onAccent ? "inverted" : "accent"}
        disabled={status === "sending"}
        className="w-full sm:w-auto"
      >
        {status === "sending" ? "กำลังส่ง…" : "รับบทความทางอีเมล"}
      </Button>
    </form>
  );
}
