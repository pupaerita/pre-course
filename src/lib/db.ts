import { PrismaClient } from "@prisma/client";

// ใช้ client ตัวเดียวร่วมกัน ไม่งั้นตอน dev จะเปิดการเชื่อมต่อใหม่ทุกครั้งที่แก้โค้ด
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
