import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { SubscribeBand } from "@/components/subscribe-band";
import { Button } from "@/components/ui/button";
import { facts, site, timeline, values } from "@/data/site";

export const metadata: Metadata = {
  title: "เรื่องราว",
  description: `เส้นทางและวิธีคิดของ${site.fullName}`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeading
        title="จากคนเขียนให้ร้านเล็ก ๆ มาเป็นที่ปรึกษาด้านการเล่าเรื่อง"
        intro={`${site.fullName} อยู่ที่${site.location} ทำงานกับแบรนด์เล็กและครีเอเตอร์ที่มีของดี แต่ยังไม่รู้จะเล่าให้คนอื่นฟังอย่างไร`}
      />

      <section className="mx-auto max-w-page px-5 sm:px-8">
        <div className="max-w-prose space-y-5 font-serif text-lg leading-loose">
          <p>
            ผมเริ่มทำงานจากการเขียนโพสต์ให้ร้านกาแฟแถวบ้าน เจ้าของร้านทำกาแฟอร่อยมาก แต่เวลาให้เขาเล่าว่าร้านต่างจากร้านอื่นอย่างไร
            เขากลับพูดได้แค่ว่า &ldquo;ก็ทำให้ดีที่สุด&rdquo; ตอนนั้นเองที่ผมเริ่มสนใจว่า ทำไมคนที่รู้เรื่องของตัวเองดีที่สุด
            ถึงเล่าเรื่องตัวเองยากที่สุด
          </p>
          <p>
            หลายปีต่อมา ผมยังเจอเหตุการณ์แบบนี้อยู่เรื่อย ๆ ไม่ว่าจะเป็นร้านเล็ก ๆ ทีมสตาร์ทอัพ หรือครีเอเตอร์คนเดียว
            งานของผมจึงไม่ใช่การแต่งเรื่องให้ แต่ช่วยขุดหาเรื่องจริงที่อยู่แล้ว แล้วจัดให้คนอ่านรับได้ง่าย
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-page px-5 sm:px-8" aria-labelledby="facts-title">
        <h2 id="facts-title" className="sr-only">
          ตัวเลขสรุป
        </h2>
        <dl className="grid gap-8 border-y border-line py-10 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-muted">{f.label}</dt>
              <dd>
                <span className="text-5xl font-semibold tracking-tight">{f.value}</span>
                <span className="ml-1.5 text-lg text-muted">{f.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-20 max-w-page px-5 sm:px-8" aria-labelledby="values-title">
        <h2 id="values-title" className="text-2xl font-semibold sm:text-3xl">
          สิ่งที่ยึดถือในการทำงาน
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {values.map((v) => (
            <li key={v.title} className="border-t-2 border-ink pt-4">
              <h3 className="text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-page px-5 sm:px-8" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="text-2xl font-semibold sm:text-3xl">
          เส้นทางที่ผ่านมา
        </h2>
        <ol className="mt-8 border-t border-line">
          {timeline.map((t) => (
            <li key={t.year} className="grid gap-x-8 gap-y-1 border-b border-line py-6 sm:grid-cols-[6rem_1fr]">
              <span className="text-muted">{t.year}</span>
              <div>
                <h3 className="text-xl font-semibold">{t.title}</h3>
                <p className="mt-1 max-w-prose text-muted">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-20 max-w-page px-5 sm:px-8">
        <p className="max-w-prose text-xl font-medium">อยากให้ช่วยดูเรื่องเล่าของแบรนด์คุณ?</p>
        <Button asChild variant="accent" className="mt-5">
          <Link href="/contact">ส่งข้อความหานิลิน</Link>
        </Button>
      </section>

      <SubscribeBand />
    </>
  );
}
