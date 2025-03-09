import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const users = await prisma.users.findMany({ take: 1 });

    res.status(200).json({
      message: "Database connected successfully!",
      users: users.length > 0 ? users : "No users found",
    });
  } catch (error) {
    console.error("Database Connection Error:", error);
    res.status(500).json({ message: "Failed to connect to Neon database" });
  } finally {
    await prisma.$disconnect();
  }
}
