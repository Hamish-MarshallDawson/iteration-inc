import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const {USERID} = req.body;
    console.log("userid", USERID);
    const energy = await prisma.EnergyUse.findMany({
      select: {
        Timestamp: true,
        EnergyUsed: true,
        UserID: true,
      },
    });

    // Group by date and sum energy usage
    let userData = {};
    let totalData = energy.reduce((acc, row) => {
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

    // Sort and extract the 7 most recent entries
    totalData = Object.fromEntries(
      Object.entries(sortDataByDate(totalData, "desc")).slice(0, 7)
    );
    userData = Object.fromEntries(
      Object.entries(sortDataByDate(userData, "desc")).slice(0, 7)
    );

    return res.status(200).json({ totalData, userData });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Helper function to sort data by date
const sortDataByDate = (data, order = "asc") => {
  // Sort the data by date
  return Object.fromEntries(
    Object.entries(data).sort(([dateA], [dateB]) => {
      if (order === "asc") {
        return dateA.localeCompare(dateB); // Sort in ascending order
      } else {
        return dateB.localeCompare(dateA); // Sort in descending order
      }
  }));

};