import Link from "next/link";
import { nav, site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear() + 543;

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-xl font-semibold">{site.name}</p>
          <p className="mt-2 max-w-sm text-muted">{site.tagline}</p>
        </div>

        <nav aria-label="เมนูท้ายหน้า">
          <p className="font-medium">หน้าในเว็บ</p>
          <ul className="mt-3 space-y-1.5 text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-medium">ตามงานของ{site.name}</p>
          <ul className="mt-3 space-y-1.5 text-muted">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ink hover:underline">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-page px-5 py-5 text-sm text-muted sm:px-8">
          © {year} {site.fullName}
        </p>
      </div>
    </footer>
  );
}
