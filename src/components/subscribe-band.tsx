import { SubscribeForm } from "@/components/subscribe-form";

// แถบสีน้ำเงินเต็มความกว้าง — จุดเดียวที่ใช้สีเน้นเต็มพื้นในทั้งเว็บ
export function SubscribeBand() {
  return (
    <section className="mt-24 bg-accent text-white" aria-labelledby="subscribe-title">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1.1fr] md:py-20">
        <div>
          <h2 id="subscribe-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            รับบทความใหม่ทางอีเมล
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/85">
            ส่งเมื่อมีบทความใหม่เท่านั้น อ่านจบในห้านาที ไม่มีเมลขายของ
          </p>
        </div>
        <SubscribeForm tone="onAccent" />
      </div>
    </section>
  );
}
