import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// รายชื่อตัวอย่าง (อีเมลสมมติ @example.com) — รันซ้ำได้ ไม่ซ้อนกัน
// ลบออกได้ทุกเมื่อก่อนเปิดใช้งานจริง
const samples = [
  { name: "ตัวอย่าง หนึ่ง", email: "sample.one@example.com" },
  { name: "ตัวอย่าง สอง", email: "sample.two@example.com" },
  { name: "ตัวอย่าง สาม", email: "sample.three@example.com" },
];

async function main() {
  for (const s of samples) {
    await prisma.subscriber.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, consent: true },
    });
  }
  console.log(`seed เสร็จ: ${samples.length} รายชื่อตัวอย่าง`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
