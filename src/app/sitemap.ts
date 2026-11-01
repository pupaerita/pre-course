import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { posts } from "@/data/posts";
import { works } from "@/data/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/work", "/blog", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  return [
    ...pages,
    ...works.map((w) => ({ url: `${siteUrl}/work/${w.slug}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: new Date(`${p.date}T00:00:00Z`) })),
  ];
}
