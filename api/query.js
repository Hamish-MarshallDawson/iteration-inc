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

    // Sort totalData and userData by date (newest to oldest)
    const sortedTotalData = sortDataByDate(totalData, "desc");
    const sortedUserData = sortDataByDate(userData, "desc");

    // Extract the 7 most recent entries
    const recentTotalData = Object.fromEntries(
      Object.entries(sortedTotalData).slice(0, 7)
    );
    const recentUserData = Object.fromEntries(
      Object.entries(sortedUserData).slice(0, 7)
    );

    return res.status(200).json({ totalData: recentTotalData, userData: recentUserData });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Helper function to sort data by date
const sortDataByDate = (data, order = "asc") => {
  // Sort the data by date
  const sortedEntries = Object.entries(data).sort(([dateA], [dateB]) => {
    if (order === "asc") {
      return dateA.localeCompare(dateB); // Sort in ascending order
    } else {
      return dateB.localeCompare(dateA); // Sort in descending order
    }
  });

  // Convert back to an object
  return Object.fromEntries(sortedEntries);
};