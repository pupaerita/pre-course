import Link from "next/link";
import type { Post } from "@prisma/client";
import { formatThaiDate } from "@/lib/content";

export function PostList({ items }: { items: Post[] }) {
  if (items.length === 0) {
    return <p className="border-y border-line py-10 text-muted">ยังไม่มีบทความ แวะกลับมาใหม่เร็ว ๆ นี้</p>;
  }
  return (
    <ul className="border-t border-line">
      {items.map((post) => {
        const date = post.publishedAt ?? post.createdAt;
        return (
        <li key={post.slug} className="border-b border-line">
          <Link
            href={`/blog/${post.slug}`}
            className="group grid gap-x-8 gap-y-1 py-7 sm:grid-cols-[11rem_1fr] sm:items-baseline"
          >
            <span className="text-muted">
              <time dateTime={date.toISOString()}>{formatThaiDate(date)}</time>
            </span>
            <span>
              <span className="block text-xl font-semibold group-hover:text-accent">{post.title}</span>
              <span className="mt-1 block max-w-prose text-muted">{post.excerpt}</span>
              <span className="mt-2 block text-sm text-muted">
                {post.tag} · อ่าน {post.readMinutes} นาที
              </span>
            </span>
          </Link>
        </li>
        );
      })}
    </ul>
  );
}
