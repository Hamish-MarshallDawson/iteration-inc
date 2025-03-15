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
      const dayMonth = date.split("-")[2] + "/" + date.split("-")[1];
      if (!acc[dayMonth]) {
        acc[dayMonth] = 0;
      }
      acc[dayMonth] += parseFloat(row.EnergyUsed);
      return acc;
    }, {});

    console.log(energy)

    return res.status(200).json({ groupedData });
    
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
