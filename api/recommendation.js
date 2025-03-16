import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const { userID, action } = req.body;

    const user = await prisma.Users.findUnique({
      where: { UserID: userID },
      select: { MachineID: true },
    });

    if (!user) {
      console.error(`🔴 User not found: ${userID}`);
      return res.status(404).json({ message: "User not found" });
    }

    const machineID = user.MachineID;

    // Get current time and today's start time
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayISO = new Date().toISOString().split("T")[0]; // Store only the date part for easy checking

    // Energy usage thresholds daily by device type
    const energyThresholds = {
      speaker: 150, // 0.25 kWh
      light: 100, // 0.1 kWh
      coffee_machine: 1000, // 1 kWh
      thermostat: 1000, // 1 kWh
      robot: 1500, // 1.5 kWh
      other: 500, // 0.5 kWh
    };

    // Device on-time thresholds by type (hours)
    const deviceOnThresholds = {
      speaker: 12, // 12 hours
      light: 10, // 10 hours
      coffee_machine: 1, // 1 hour
      thermostat: 24, // 24 hours
      robot: 8, // 8 hours
      other: 12, // 12 hours
    };

    switch (action) {
      case "fetch":
        // ✅ Fetch recommendations for the user
        const storedRecommendations = await prisma.Recommendations.findMany({
          where: { UserID: userID,
                EnvConditions: {
                    contains: todayISO,
                },
           },
          select: {
            RecID: true,
            DeviceID: true,
            DeviceConditions: true,
            EnvConditions: true,
            SuggestedAction: true,
            MachineID: true,
          },
        });
        console.log(`✅ Recommendations fetched for user ${userID}:`, storedRecommendations);
        return res.status(200).json({ recommendations: storedRecommendations });

      case "check":
        // ✅ Fetch user devices
        const devices = await prisma.Devices.findMany({
          where: { UserID: userID },
          select: { DeviceID: true, DeviceType: true },
        });

        if (devices.length === 0) {
          console.warn(`⚠️ No devices found for user ${userID}`);
        }

        let recommendations = [];

        for (const device of devices) {
          const deviceID = device.DeviceID;
          const deviceIDString = deviceID.toString();
          const deviceType = device.DeviceType.toLowerCase();

          console.log(`🔍 Checking device ${deviceID} (${deviceType}) for recommendations...`);

          // ✅ Fetch total energy usage for this device today
          const energyUsage = await prisma.EnergyUse.aggregate({
            where: {
              DeviceID: deviceID,
              Timestamp: { gte: startOfDay, lte: now },
            },
            _sum: { EnergyUsed: true },
          });

          const totalEnergyUsed = energyUsage._sum.EnergyUsed || 0;

          console.log(
            `🔹 Device ${deviceID} (${deviceType}) used ${totalEnergyUsed} Wh today (Threshold: ${energyThresholds[deviceType]})`
          );

          // ✅ Check if energy usage exceeds the threshold
          if (energyThresholds[deviceType] && totalEnergyUsed > energyThresholds[deviceType]) {
            // ✅ Check if a recommendation already exists for today
            const existingRec = await prisma.Recommendations.findFirst({
              where: {
                UserID: userID,
                DeviceID: deviceID,
                SuggestedAction: {
                  contains: "is using too much energy today",
                },
                EnvConditions: {
                  contains: todayISO, // ✅ Check if stored today
                },
              },
            });

            if (!existingRec) {
              console.log(`⚠️ Device ${deviceID} exceeded energy threshold! Adding recommendation.`);
              recommendations.push({
                UserID: userID,
                DeviceID: deviceID,
                MachineID: machineID || null,
                DeviceConditions: JSON.stringify({ energyUsage: totalEnergyUsed }),
                EnvConditions: JSON.stringify({ timestamp: todayISO }), // ✅ Store today's timestamp
                SuggestedAction: `Your ${deviceType} is using too much energy today (${totalEnergyUsed} Wh). Consider turning it off.`,
              });
            }
          }

          // ✅ Fetch the last activity of the device
          const lastActivity = await prisma.UserActivity.findFirst({
            where: { 
              DeviceID: deviceIDString, 
              Action: "Turn_On" 
            },
            orderBy: { Timestamp: "desc" },
            select: { Action: true, Timestamp: true },
          });

          if (!lastActivity) {
            console.log(`⚠️ No activity history found for device ${deviceID}, skipping on-time check.`);
            continue; // ✅ Skip to next device if no history exists
          }

          const lastActivityTime = new Date(lastActivity.Timestamp); // ✅ Only runs if lastActivity exists
          const timeSinceOn = (now - lastActivityTime) / (1000 * 60 * 60); // Convert to hours
          console.log(`🔹 Device ${deviceID} last turned ON ${timeSinceOn.toFixed(2)} hours ago.`);

          // ✅ Check if the device has been ON for too long
          if (deviceOnThresholds[deviceType] && timeSinceOn >= deviceOnThresholds[deviceType]) {
            // ✅ Check if a recommendation already exists for today
            const existingRec = await prisma.Recommendations.findFirst({
              where: {
                UserID: userID,
                DeviceID: deviceID,
                SuggestedAction: {
                  contains: "has been on for over",
                },
                EnvConditions: {
                  contains: todayISO, // ✅ Check if stored today
                },
              },
            });

            if (!existingRec) {
              console.log(`⚠️ Device ${deviceID} has been ON for too long! Adding recommendation.`);
              recommendations.push({
                UserID: userID,
                DeviceID: deviceID,
                MachineID: machineID || null,
                DeviceConditions: JSON.stringify({ lastOnTime: lastActivity.Timestamp }),
                EnvConditions: JSON.stringify({ timestamp: todayISO }), // ✅ Store today's timestamp
                SuggestedAction: `Your ${deviceType} has been on for over ${deviceOnThresholds[deviceType]} hours. Consider turning it off.`,
              });
            }
          }
        }

        console.log(`🔹 Final Recommendations for user ${userID}:`, recommendations);

        // ✅ Store new recommendations in the database (Only if there are any)
        if (recommendations.length > 0) {
          await prisma.Recommendations.createMany({
            data: recommendations,
            skipDuplicates: true, // ✅ Prevent duplicate entries
          });
          console.log(`✅ ${recommendations.length} recommendations stored for user ${userID}`);
        } else {
          console.log(`✅ No new recommendations generated for user ${userID}`);
        }

        return res.status(200).json({ message: "Recommendation check completed" });

      default:
        console.warn(`❌ Invalid action received: ${action}`);
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("❌ Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
