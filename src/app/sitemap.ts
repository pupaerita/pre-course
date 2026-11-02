import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { getPublishedPosts, getPublishedWorks } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, posts] = await Promise.all([getPublishedWorks(), getPublishedPosts()]);
  const pages = ["", "/about", "/work", "/blog", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  return [
    ...pages,
    ...works.map((w) => ({ url: `${siteUrl}/work/${w.slug}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
