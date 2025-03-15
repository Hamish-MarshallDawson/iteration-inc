import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {

    const energy = await prisma.EnergyUse.findMany({
      select: {
        Timestamp: true,
        EnergyUsed: true,
      },
    });

    // Group by date and sum energy usage
    const groupedData = energy.reduce((acc, row) => {
      const date = new Date(row.Timestamp).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += row.EnergyUsed;
      return acc;
    }, {});

    console.log(energy)

    return res.status(200).json({ groupedData });
    
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
