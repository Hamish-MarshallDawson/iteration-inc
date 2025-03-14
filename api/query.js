import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    // Fetch all awards

    
    // const { UserID, machineID} = req.body;


    const energy = await prisma.EnergyUse.findMany({
      select: {
        Timestamp: true,
        EnergyUse: true,
      },
    });

    return res.status(200).json({ energy });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
