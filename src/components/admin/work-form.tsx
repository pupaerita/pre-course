"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { Field, useContentSave } from "@/components/admin/editor-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type WorkFormValues = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  summary: string;
  role: string;
  challenge: string;
  approach: string[];
  result: string;
  featured: boolean;
  published: boolean;
};

export function WorkForm({ initial }: { initial?: WorkFormValues }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { busy, message, notice, errors, save, remove } = useContentSave({
    api: "/api/admin/works",
    listHref: "/admin/works",
    id: initial?.id,
  });
  const isPublished = initial?.published ?? false;

  function submit(published: boolean) {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const text = (name: string) => String(data.get(name) ?? "");
    void save({
      slug: text("slug"),
      title: text("title"),
      client: text("client"),
      year: text("year"),
      category: text("category"),
      summary: text("summary"),
      role: text("role"),
      challenge: text("challenge"),
      approach: text("approach"),
      result: text("result"),
      featured: data.get("featured") === "on",
      published,
    });
  }

  function field(name: keyof WorkFormValues) {
    return {
      id: `${uid}-${name}`,
      name,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
    };
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(isPublished);
      }}
      className="max-w-3xl space-y-5"
    >
      <Field id={`${uid}-title`} label="ชื่อผลงาน" error={errors.title}>
        <Input {...field("title")} defaultValue={initial?.title} />
      </Field>
      <Field
        id={`${uid}-slug`}
        label="ลิงก์หน้า (slug)"
        hint="ภาษาอังกฤษพิมพ์เล็ก คั่นด้วยขีด เช่น coffee-by-the-canal · จะเป็นที่อยู่ /work/ชื่อนี้"
        error={errors.slug}
      >
        <Input {...field("slug")} defaultValue={initial?.slug} autoCapitalize="none" spellCheck={false} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-client`} label="ลูกค้า" error={errors.client}>
          <Input {...field("client")} defaultValue={initial?.client} />
        </Field>
        <Field id={`${uid}-year`} label="ปี (พ.ศ.)" error={errors.year}>
          <Input {...field("year")} defaultValue={initial?.year} inputMode="numeric" maxLength={4} />
        </Field>
        <Field id={`${uid}-category`} label="ประเภทงาน" error={errors.category}>
          <Input {...field("category")} defaultValue={initial?.category} />
        </Field>
        <Field id={`${uid}-role`} label="บทบาทของคุณ" error={errors.role}>
          <Input {...field("role")} defaultValue={initial?.role} />
        </Field>
      </div>
      <Field id={`${uid}-summary`} label="สรุปสั้น" hint="แสดงใต้ชื่อในรายการผลงาน 1–2 ประโยค" error={errors.summary}>
        <Textarea {...field("summary")} defaultValue={initial?.summary} rows={2} />
      </Field>
      <Field id={`${uid}-challenge`} label="โจทย์" error={errors.challenge}>
        <Textarea {...field("challenge")} defaultValue={initial?.challenge} rows={4} />
      </Field>
      <Field id={`${uid}-approach`} label="สิ่งที่ทำ" hint="หนึ่งข้อต่อหนึ่งบรรทัด" error={errors.approach}>
        <Textarea {...field("approach")} defaultValue={initial?.approach.join("\n")} rows={5} />
      </Field>
      <Field id={`${uid}-result`} label="ผลที่ได้" error={errors.result}>
        <Textarea {...field("result")} defaultValue={initial?.result} rows={4} />
      </Field>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial?.featured}
          className="size-5 accent-accent"
        />
        <span>โชว์ในหัวข้อ &ldquo;ผลงานที่ภูมิใจ&rdquo; ที่หน้าแรก</span>
      </label>

      {message && (
        <p role="alert" className="text-red-700">
          {message}
        </p>
      )}
      {notice && (
        <p role="status" className="text-accent">
          {notice}
          {isPublished && initial && (
            <>
              {" · "}
              <Link href={`/work/${initial.slug}`} className="underline" target="_blank">
                ดูบนหน้าเว็บ
              </Link>
            </>
          )}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        {isPublished ? (
          <>
            <Button type="button" variant="accent" disabled={busy} onClick={() => submit(true)}>
              {busy ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => submit(false)}>
              ยกเลิกเผยแพร่ (กลับเป็นร่าง)
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="accent" disabled={busy} onClick={() => submit(true)}>
              {busy ? "กำลังบันทึก…" : "เผยแพร่"}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => submit(false)}>
              บันทึกเป็นร่าง
            </Button>
          </>
        )}
        <Button asChild variant="ghost">
          <Link href="/admin/works">กลับไปรายการ</Link>
        </Button>
        {initial && (
          <Button type="button" variant="ghost" disabled={busy} onClick={remove} className="ml-auto text-red-700">
            ลบผลงาน
          </Button>
        )}
      </div>
    </form>
  );
}
