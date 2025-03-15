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

    // Group by date and sum energy usage
    const groupedData = energy.reduce((acc, row) => {
      const date = new Date(row.Timestamp).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += row.EnergyUsed;
      return acc;
    }, {});

    // Convert to the desired format
    const totalData = Object.keys(groupedData).map(date => {
      const [year, month, day] = date.split('-'); // Split the date string into year, month, and day
      return {
        year: parseInt(year, 10), // Convert to number
        month: parseInt(month, 10), // Convert to number
        day: parseInt(day, 10), // Convert to number
        totalEnergyUsed: groupedData[date],
      };
    });

    return res.status(200).json({ totalData });
    
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
