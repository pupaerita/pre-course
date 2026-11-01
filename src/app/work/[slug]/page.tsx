import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubscribeBand } from "@/components/subscribe-band";
import { Button } from "@/components/ui/button";
import { getWork, works } from "@/data/works";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  return work ? { title: work.title, description: work.summary } : {};
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const index = works.findIndex((w) => w.slug === work.slug);
  const next = works[(index + 1) % works.length];

  return (
    <>
      <article className="mx-auto max-w-page px-5 pb-4 pt-14 sm:px-8 sm:pt-20">
        <Link href="/work" className="text-muted hover:text-ink hover:underline">
          ผลงานทั้งหมด
        </Link>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{work.title}</h1>
        <p className="mt-5 max-w-prose text-lg text-muted">{work.summary}</p>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
          {[
            ["ลูกค้า", work.client],
            ["ปี", work.year],
            ["ประเภทงาน", work.category],
            ["บทบาท", work.role],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="text-sm text-muted">{term}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_2fr]">
          <h2 className="text-2xl font-semibold">โจทย์</h2>
          <p className="max-w-prose font-serif text-lg leading-loose">{work.challenge}</p>

          <h2 className="text-2xl font-semibold">สิ่งที่ทำ</h2>
          <ol className="max-w-prose list-decimal space-y-3 pl-6 font-serif text-lg leading-loose marker:text-muted">
            {work.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h2 className="text-2xl font-semibold">ผลที่ได้</h2>
          <p className="max-w-prose font-serif text-lg leading-loose">{work.result}</p>
        </div>

        {next && next.slug !== work.slug && (
          <div className="mt-16 border-t border-line pt-8">
            <p className="text-sm text-muted">ผลงานถัดไป</p>
            <Link href={`/work/${next.slug}`} className="mt-1 inline-block text-xl font-semibold hover:text-accent">
              {next.title}
            </Link>
          </div>
        )}

        <div className="mt-12">
          <Button asChild variant="accent">
            <Link href="/contact">มีโจทย์คล้ายกัน? คุยกัน</Link>
          </Button>
        </div>
      </article>
      <SubscribeBand />
    </>
  );
}
