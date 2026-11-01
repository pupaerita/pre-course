import Link from "next/link";
import { formatThaiDate, type Post } from "@/data/posts";

export function PostList({ items }: { items: Post[] }) {
  return (
    <ul className="border-t border-line">
      {items.map((post) => (
        <li key={post.slug} className="border-b border-line">
          <Link
            href={`/blog/${post.slug}`}
            className="group grid gap-x-8 gap-y-1 py-7 sm:grid-cols-[11rem_1fr] sm:items-baseline"
          >
            <span className="text-muted">
              <time dateTime={post.date}>{formatThaiDate(post.date)}</time>
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
      ))}
    </ul>
  );
}
