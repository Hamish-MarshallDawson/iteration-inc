import { prisma } from "./globalPrisma.js";


const USERID = 6;



export default async function handler(req, res) {
  try {

    const energy = await prisma.EnergyUse.findMany({
      select: {
        Timestamp: true,
        EnergyUsed: true,
        userID: true,
      }
    });

    // Group by date and sum energy usage
    const userData = {};
    const totalData = energy.reduce((acc, row) => {
      const date = new Date(row.Timestamp).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      const dayMonth = date.split("-")[2] + "/" + date.split("-")[1]; // Format to DD/MM

      // totalData
      if (!acc[dayMonth]) {
        acc[dayMonth] = 0;
      }
      acc[dayMonth] += parseFloat(row.EnergyUsed);

      // userData
      if (row.userID == USERID) {
        if (!userData[dayMonth]) {
          userData[dayMonth] = 0;
        }
        userData[dayMonth] += parseFloat(row.EnergyUsed);
      }

      return acc;
    }, {});

    return res.status(200).json({ totalData, userData });
    
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
