import Link from "next/link";
import { PostList } from "@/components/post-list";
import { SubscribeBand } from "@/components/subscribe-band";
import { Button } from "@/components/ui/button";
import { WorkList } from "@/components/work-list";
import { facts, site } from "@/data/site";
import { posts } from "@/data/posts";
import { works } from "@/data/works";

const LATEST_POSTS = 3;

export default function HomePage() {
  const featured = works.filter((w) => w.featured);
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, LATEST_POSTS);

  return (
    <>
      <section className="mx-auto max-w-page px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-28">
        <p className="text-lg text-muted">{site.role}</p>
        <h1 className="mt-5 max-w-5xl text-[clamp(2.5rem,7.5vw,5.75rem)] font-semibold leading-[1.15] tracking-tight">
          {site.tagline}
        </h1>
        <p className="mt-8 max-w-prose text-lg text-muted">{site.description}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="accent">
            <Link href="/work">ดูผลงาน</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">คุยกับนิลิน</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-page px-5 sm:px-8" aria-labelledby="work-title">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 id="work-title" className="text-2xl font-semibold sm:text-3xl">
            ผลงานที่ภูมิใจ
          </h2>
          <Link href="/work" className="text-accent hover:underline">
            ผลงานทั้งหมด
          </Link>
        </div>
        <WorkList items={featured} />
      </section>

      <section className="mx-auto mt-24 grid max-w-page gap-10 px-5 sm:px-8 md:grid-cols-[1fr_1.2fr]" aria-labelledby="about-title">
        <h2 id="about-title" className="text-2xl font-semibold sm:text-3xl">
          เกี่ยวกับนิลิน
        </h2>
        <div>
          <p className="max-w-prose text-lg">
            นิลินเริ่มจากการเขียนคอนเทนต์ให้ร้านเล็ก ๆ แล้วพบว่าปัญหาของแบรนด์ส่วนใหญ่ไม่ใช่ขาดของดี
            แต่เล่าไม่ถูกจุด ตอนนี้นิลินช่วยแบรนด์และครีเอเตอร์หาเรื่องที่ควรเล่า และเล่าให้สม่ำเสมอ
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="text-3xl font-semibold sm:text-4xl">{f.value}</span>
                  <span className="ml-1 text-muted">{f.unit}</span>
                  <span className="mt-1 block text-sm text-muted" aria-hidden="true">
                    {f.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="mt-8 inline-block text-accent hover:underline">
            อ่านเรื่องราวของนิลิน
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-page px-5 sm:px-8" aria-labelledby="blog-title">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 id="blog-title" className="text-2xl font-semibold sm:text-3xl">
            บทความล่าสุด
          </h2>
          <Link href="/blog" className="text-accent hover:underline">
            บทความทั้งหมด
          </Link>
        </div>
        <PostList items={latest} />
      </section>

      <SubscribeBand />
    </>
  );
}
