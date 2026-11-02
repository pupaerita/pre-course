import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubscribeBand } from "@/components/subscribe-band";
import { formatThaiDate, getPublishedPost, parseBody } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const date = post.publishedAt ?? post.createdAt;

  return (
    <>
      <article className="mx-auto max-w-page px-5 pb-4 pt-14 sm:px-8 sm:pt-20">
        <Link href="/blog" className="text-muted hover:text-ink hover:underline">
          บทความทั้งหมด
        </Link>
        <header className="mt-6 max-w-prose">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-muted">
            <time dateTime={date.toISOString()}>{formatThaiDate(date)}</time> · {post.tag} · อ่าน {post.readMinutes} นาที
          </p>
        </header>

        <div className="mt-10 max-w-prose space-y-6 font-serif text-lg leading-loose">
          {parseBody(post.body).map((block, i) =>
            block.type === "h2" ? (
              <h2 key={i} className="pt-4 font-sans text-2xl font-semibold leading-snug">
                {block.text}
              </h2>
            ) : (
              <p key={i} className="whitespace-pre-line">
                {block.text}
              </p>
            ),
          )}
        </div>
      </article>
      <SubscribeBand />
    </>
  );
}
