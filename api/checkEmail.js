import { prisma } from "./globalPrisma.js"; // Import shared Prisma client

export default async function handler(req, res) {
  try {

    const { email } = req.body;

    // Check if email exists in the Users table
    const existingUser = await prisma.Users.findFirst({
      where: { Email: email },
    });
    

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(200).json({ message: "Email available" });
    
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
