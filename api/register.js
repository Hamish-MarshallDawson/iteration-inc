import { PrismaClient } from "@prisma/client";

// Ensure Prisma Client is reused to avoid too many connections in Serverless environments
const globalForPrisma = globalThis;
globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient();
export const prisma = globalForPrisma.prisma;

export default async function handler(req, res) {

  const { email, password } = req.body;

  try {
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: { email, password },
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
