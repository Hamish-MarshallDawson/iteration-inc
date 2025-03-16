import { prisma } from "./globalPrisma.js";

const USERID = 6;

export default async function handler(req, res) {
  try {
    const energy = await prisma.EnergyUse.findMany({
      select: {
        Timestamp: true,
        EnergyUsed: true,
        UserID: true,
      },
    });

    // Group by date and sum energy usage
    const userData = {};
    const totalData = energy.reduce((acc, row) => {
      
      const date = new Date(row.Timestamp).toISOString().split("T")[0]; // Extract YYYY-MM-DD

      // totalData
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += parseFloat(row.EnergyUsed);

      // userData
      if (!userData[date]) {
        userData[date] = 0;
      }
      if (row.UserID === USERID) {
        userData[date] += parseFloat(row.EnergyUsed);
      }

      return acc;
    }, {});

    // Sort totalData and userData by date
    const sortedTotalData = sortDataByDate(totalData);
    const sortedUserData = sortDataByDate(userData);

    return res.status(200).json({ totalData: sortedTotalData, userData: sortedUserData });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Helper function to sort data by date
const sortDataByDate = (data) => {
  // Sort the data by date (YYYY-MM-DD is lexicographically sortable)
  const sortedEntries = Object.entries(data).sort(([dateA], [dateB]) => {
    return dateA.localeCompare(dateB); // Sort in ascending order
  });

  // Convert back to an object
  return Object.fromEntries(sortedEntries);
};