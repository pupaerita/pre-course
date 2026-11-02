"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { Field, useContentSave } from "@/components/admin/editor-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type PostFormValues = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  body: string;
  readMinutes: number;
  published: boolean;
};

export function PostForm({ initial }: { initial?: PostFormValues }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { busy, message, notice, errors, save, remove } = useContentSave({
    api: "/api/admin/posts",
    listHref: "/admin/posts",
    id: initial?.id,
  });
  const isPublished = initial?.published ?? false;

  function submit(published: boolean) {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    void save({
      slug: String(data.get("slug") ?? ""),
      title: String(data.get("title") ?? ""),
      tag: String(data.get("tag") ?? ""),
      readMinutes: String(data.get("readMinutes") ?? ""),
      excerpt: String(data.get("excerpt") ?? ""),
      body: String(data.get("body") ?? ""),
      published,
    });
  }

  function field(name: keyof PostFormValues) {
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
      <Field id={`${uid}-title`} label="หัวข้อบทความ" error={errors.title}>
        <Input {...field("title")} defaultValue={initial?.title} />
      </Field>
      <Field
        id={`${uid}-slug`}
        label="ลิงก์หน้า (slug)"
        hint="ภาษาอังกฤษพิมพ์เล็ก คั่นด้วยขีด เช่น my-first-post · จะเป็นที่อยู่ /blog/ชื่อนี้"
        error={errors.slug}
      >
        <Input {...field("slug")} defaultValue={initial?.slug} autoCapitalize="none" spellCheck={false} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-tag`} label="หมวด" error={errors.tag}>
          <Input {...field("tag")} defaultValue={initial?.tag} />
        </Field>
        <Field id={`${uid}-readMinutes`} label="เวลาอ่าน (นาที)" error={errors.readMinutes}>
          <Input {...field("readMinutes")} type="number" min={1} defaultValue={initial?.readMinutes ?? 3} />
        </Field>
      </div>
      <Field id={`${uid}-excerpt`} label="คำโปรย" hint="แสดงใต้หัวข้อในรายการบทความ 1–2 ประโยค" error={errors.excerpt}>
        <Textarea {...field("excerpt")} defaultValue={initial?.excerpt} rows={3} />
      </Field>
      <Field
        id={`${uid}-body`}
        label="เนื้อหา"
        hint={'เว้น 1 บรรทัดว่างเพื่อขึ้นย่อหน้าใหม่ · ขึ้นต้นบรรทัดด้วย "## " (มีเว้นวรรคตามหลัง) เพื่อทำหัวข้อย่อย'}
        error={errors.body}
      >
        <Textarea {...field("body")} defaultValue={initial?.body} rows={18} className="font-serif leading-relaxed" />
      </Field>

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
              <Link href={`/blog/${initial.slug}`} className="underline" target="_blank">
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
          <Link href="/admin/posts">กลับไปรายการ</Link>
        </Button>
        {initial && (
          <Button type="button" variant="ghost" disabled={busy} onClick={remove} className="ml-auto text-red-700">
            ลบบทความ
          </Button>
        )}
      </div>
    </form>
  );
}
