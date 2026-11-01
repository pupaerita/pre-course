import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { SubscribeForm } from "@/components/subscribe-form";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "ติดต่อ",
  description: `ติดต่อ${site.fullName} เรื่องงานให้คำปรึกษา เวิร์กชอป หรือความร่วมมือ`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeading
        title="ติดต่อ"
        intro="อยากปรึกษางาน ชวนไปสอน หรือแค่ทักทาย ส่งอีเมลมาได้เลย เล่าสั้น ๆ ว่าคุณทำอะไรและอยากได้อะไร"
      />

      <section className="mx-auto grid max-w-page gap-14 px-5 sm:px-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">ช่องทางติดต่อ</h2>
          <ul className="mt-5 space-y-3 text-lg">
            <li>
              <span className="block text-sm text-muted">อีเมล</span>
              <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              <span className="block text-sm text-muted">ที่อยู่</span>
              {site.location}
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <span className="block text-sm text-muted">{s.label}</span>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  เปิดหน้า {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">รับบทความทางอีเมล</h2>
          <p className="mb-6 mt-2 max-w-prose text-muted">
            ไม่ต้องคุยกันก็ได้ ฝากชื่อกับอีเมลไว้ แล้วเราจะส่งบทความใหม่ไปให้เมื่อมีเท่านั้น
          </p>
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}
