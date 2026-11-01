import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <PageHeading title="ไม่พบหน้านี้" intro="ลิงก์อาจพิมพ์ผิดหรือหน้านี้ถูกย้ายไปแล้ว ลองกลับไปที่หน้าแรกหรือดูผลงานแทน" />
      <div className="mx-auto flex max-w-page gap-3 px-5 sm:px-8">
        <Button asChild variant="accent">
          <Link href="/">กลับหน้าแรก</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/work">ดูผลงาน</Link>
        </Button>
      </div>
    </>
  );
}
