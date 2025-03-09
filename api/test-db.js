import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient();
export const prisma = globalForPrisma.prisma;

export default async function handler(req, res) {
  try {
    const users = await prisma.users.findMany({ take: 1 });

    res.status(200).json({
      message: "Database connected successfully on Vercel!",
      users: users.length > 0 ? users : "No users found",
    });
  } catch (error) {
    console.error("Database Connection Error:", error);
    res.status(500).json({ message: "Failed to connect to Neon database" });
  }
}
