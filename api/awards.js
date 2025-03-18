import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const { userID } = req.body;

    // Get the current month and week
    const now = new Date();

    // Get the start of the week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    // Get the start and end of the month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);


//------------------------------------------Evaluate conditions-------------------------------------------------------------------

    //------------------------------------------Calculate Energy Usage-------------------------------------------------------------------
    
    // Sum of total energy usage in the past 7 days by this user
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

    //------------------------------------------Count devices and activities-------------------------------------------------------------------
    // Count of all devices owned by this user
    const deviceCount = await prisma.Devices.count({ where: { UserID: userID } });

    // Count of all devices toggled by this user (user activities table)
    const toggleActions = await prisma.UserActivity.count({
      where: { UserID: userID },
    });

    //------------------------------------------Fetch Energy goal-------------------------------------------------------------------
    // Fetch the energy goal of this month
    const user = await prisma.Users.findUnique({
      where: { UserID: userID },
      select: { EnergyGoal: true },
    });
    const energyGoal = user.EnergyGoal 

//------------------------------------------Fetch awards-------------------------------------------------------------------

    // Fetch all unlocked awards for this user
    const unlockedAwards = await prisma.UserAwards_.findMany({
      where: { UserID_: userID },
      select: { 
        AwardID_: true,
        DateEarned_: true,  
        IsUnlocked_: true,
        Awards: {           
          select: {
            AwardID: true,
            Title: true,
            Description: true,
            Icon: true,
            Type: true,
            Level: true,
          },
        },
      },
    });
    console.log("Unlocked Awards:", unlockedAwards);

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
    console.log("All Awards:", awards);

    // Check the id of awards that user already unlocked
    // This is to prevent re-adding the same award to the user
    const unlockedAwardIDs = new Set(unlockedAwards.map((award) => award.AwardID));
    let newlyUnlocked = [];


    // Loop through each award to check if the user meets the condition
    for (const award of awards) {
      // Skip if the award is already unlocked
      if (unlockedAwardIDs.has(award.AwardID)) continue;

      // Parse condition
      const condition = award.Condition || {};
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
        
        // Skip if the award is already unlocked
        if (existingAward) {
          continue;
        } else {
          await prisma.UserAwards_.create({
            data: {
              UserID_: userID,
              AwardID_: award.AwardID,
              IsUnlocked_: true,
              DateEarned_: new Date(),
            },
          });
          // Add the newly unlocked award to the list
          newlyUnlocked.push({ ...award, IsUnlocked: true, DateEarned_: new Date() });
          unlockedAwardIDs.add(award.AwardID);
        }

        
      }
    }

    //----------------------------------------------------------------------------------------------------------------------------
    // Map unlocked awards to award ID
    // This is to quickly check if an award is unlocked or not
    const unlockedAwardMap = new Map(
      unlockedAwards.map((ua) => [ua.AwardID_, { ...ua.Awards, DateEarned: ua.DateEarned_, IsUnlocked: ua.IsUnlocked_ }])
    );

    // Add the status of each award to the response
    // This includes the date earned and if the award is unlocked
    const awardsWithStatus = awards.map((award) => ({
      ...award,
      IsUnlocked: unlockedAwardMap.has(award.AwardID),
      DateEarned: unlockedAwardMap.get(award.AwardID)?.DateEarned || null,
    }));

    // Return the awards with status and unlocked awards
    // Also return the newly unlocked awards
    return res.status(200).json({ awards: awardsWithStatus,
                                  unlockedAwards: unlockedAwardMap,
                                  newlyUnlocked });


  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
