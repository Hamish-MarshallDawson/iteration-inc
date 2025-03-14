import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {

    const { action, ...data} = req.body;


    const energyUsageMap = {
        coffee_machine: 100, //30s consumption
        speaker: 50,        //1h consumption
        light: 10,          //1h consumption
        thermostat: 50,    //1h consumption
        robot: 80,         //1h consumption
        other: 50,         //1h consumption
      };
      const dailyUsagePatternMap = {
        coffee_machine: 0.5, //30s consumption
        speaker: 3,        //1h consumption
        light: 6,          //1h consumption
        thermostat: 20,    //1h consumption
        robot: 4,         //1h consumption
        other: 5,         //1h consumption
      };



    switch (action){
        case "increment":
            // Get energy use based on device type
            const energyUsed = energyUsageMap[data.deviceType.toLowerCase()];
            await prisma.EnergyUse.create({
                data: {
                  DeviceID: data.deviceID,
                  UserID: data.userID,
                  Timestamp: new Date(),
                  EnergyUsed: energyUsed,
                  MachineID: data.machineID
                },
            });
            return res.status(200).json({ message: "Energy Logged Successfully" });
        
        case "simulateWeeklyUsage":
            const onlineDevices = await prisma.Devices.findMany({
                where: {
                  UserID: data.userID,
                  Status: "Online",
                },
                select: {
                  DeviceID: true,
                  DeviceType: true,
                },
            });

            console.log("Retrieved Online Devices:", onlineDevices);

            if (onlineDevices.length === 0) {
                console.log("No online devices found.");
                return res.status(200).json({ message: "No online devices found, skipping simulation." });
            }

            const energyLogs = onlineDevices.map((device) => {

                console.log("Processing device:", device);
                const deviceTypeKey = device.DeviceType.toLowerCase();
                if (!energyUsageMap[deviceTypeKey] || !dailyUsagePatternMap[deviceTypeKey]) {
                  console.error(`Device type ${device.DeviceType} is missing in energy usage maps.`);
                  return null; // Skip if type is not found in the map
                }
                const energyUsed = energyUsageMap[device.DeviceType.toLowerCase()];
                const dailyUsage = dailyUsagePatternMap[device.DeviceType.toLowerCase()];
                const weeklyEnergyUsed = energyUsed * dailyUsage * 7;
      
                return {
                  DeviceID: device.DeviceID,
                  UserID: data.userID,
                  MachineID: data.machineID,
                  Timestamp: new Date(),
                  EnergyUsed: weeklyEnergyUsed,
                };
            });

            console.log("Generated Energy Logs:", energyLogs);

            if (energyLogs.length > 0) {
                await prisma.EnergyUse.createMany({ data: energyLogs });
                console.log("Energy logs inserted successfully.");
                return res.status(201).json({ message: "Weekly energy usage simulated successfully" });
            } else {
                console.log("No valid energy logs to insert.");
                return res.status(200).json({ message: "No energy logs to insert" });
            }


        default:
                return res.status(400).json({ message: "Invalid action" });

    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
