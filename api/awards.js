import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    // Fetch all awards
    const awards = await prisma.Awards.findMany({
      select: {
        AwardID: true,
        Title: true,
        Description: true,
        Icon: true,
        Type: true,
        Level: true,
      },
    });

    return res.status(200).json({ awards });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
