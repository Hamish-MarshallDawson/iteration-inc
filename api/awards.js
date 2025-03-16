import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const { userID } = req.body;

    // Get the current month and week
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);


    //----------------------------------------------------------------------------------------------------------------------------
    // Prepare the variable for comparing condition with each awards
    
    // Weekly energy usage
    const weeklyEnergyUsage = await prisma.EnergyUse.aggregate({
      where: {
        UserID: userID,
        Timestamp: {
          gte: startOfWeek,
          lte: now,
        },
      },
      _sum: { EnergyUsed: true },
    });
    const totalWeeklyUsage = weeklyEnergyUsage._sum.EnergyUsed;


    // Sum of total energy usage in the current month by this user
    const monthlyEnergyUsage = await prisma.EnergyUse.aggregate({
      where: {
        UserID: userID,
        Timestamp: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { EnergyUsed: true },
    });
    const totalMonthlyUsage = monthlyEnergyUsage._sum.EnergyUsed || 0;


    // Count of all devices owned by this user
    const deviceCount = await prisma.Devices.count({ where: { UserID: userID } });


    // Count of all devices toggled by this user (user activities table)
    const toggleActions = await prisma.UserActivity.count({
      where: { UserID: userID },
    });

    // Fetch the energy goal of this month
    const user = await prisma.Users.findUnique({
      where: { UserID: userID },
      select: { EnergyGoal: true },
    });
    const energyGoal = user.EnergyGoal 
    //----------------------------------------------------------------------------------------------------------------------------
    // Fetch awards

    // Fetch all unlocked awards
    const unlockedAwards = await prisma.UserAwards_.findMany({
      where: { UserID_: userID },
      select: { AwardID_: true },
    });

    // Fetch all awards
    const awards = await prisma.Awards.findMany({
      select: {
        AwardID: true,
        Title: true,
        Description: true,
        Icon: true,
        Condition: true,
        Type: true,
        Level: true,
      },
    });

    // Check the id of awards that user already unlocked
    const unlockedAwardIDs = new Set(unlockedAwards.map((award) => award.AwardID));
    let newlyUnlocked = [];


    // Loop through each award to check if the user meets the condition
    for (const award of awards) {
      // Skip if the award is already unlocked
      if (unlockedAwardIDs.has(award.AwardID)) continue;

      // Parse condition JSON
      const condition = award.Condition || {};
      console.log("Raw Condition Data:", award.Condition);
      let meetsCondition = false;

      // Check if the user meets the condition of the award
      if (condition.energyUsageBelow !== undefined && condition.timePeriod !== undefined) {
        if (condition.timePeriod === 7) {
          meetsCondition = totalWeeklyUsage < condition.energyUsageBelow; // Check for past 7 days
        } else if (condition.timePeriod === 30) {
          meetsCondition = totalMonthlyUsage < condition.energyUsageBelow; // Check for current month
        }
      } else if (condition.toggled !== undefined) {
        meetsCondition = toggleActions >= condition.toggled; // Check toggle count
      } else if (condition.numberOfDevices !== undefined) {
        meetsCondition = deviceCount >= condition.numberOfDevices; // Check device count
      } else if (condition.goal !== undefined && energyGoal !== null) {
        meetsCondition = totalMonthlyUsage < energyGoal; // Check energy goal
      }


      // Write to user award table if the user meets the condition
      if (meetsCondition) {
        const existingAward = await prisma.UserAwards_.findFirst({
          where: {
            UserID_: userID,
            AwardID_: award.AwardID,
          },
        });

        if (!existingAward) {
          await prisma.UserAwards_.create({
            data: {
              UserID_: userID,
              AwardID_: award.AwardID,
              IsUnlocked_: true,
              DateEarned_: new Date(),
            },
          });
        }

        newlyUnlocked.push({ ...award, IsUnlocked: true });
      }
    }


    //----------------------------------------------------------------------------------------------------------------------------

    const awardsWithStatus = awards.map((award) => ({
      ...award,
      IsUnlocked: 
        unlockedAwardIDs.has(award.AwardID) || 
        newlyUnlocked.some((a) => a.AwardID === award.AwardID),
    }));

    return res.status(200).json({ awards: awardsWithStatus,unlockedAwards,newlyUnlocked });


  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
