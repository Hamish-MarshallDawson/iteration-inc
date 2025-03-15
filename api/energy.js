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
        coffee_machine: 0.5, //30m usage per day
        speaker: 3,        //3h usage per day
        light: 6,          //6h usage per day
        thermostat: 20,    //20h usage per day
        robot: 4,         //4h usage per day
        other: 5,         //5h usage per day
      };



    switch (action){
 //-------------------------------------------------------------------------------------------------------------------
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
//-------------------------------------------------------------------------------------------------------------------       
        case "simulateWeeklyUsage":
        //-------------------------------------------------------------------------------------------------------------------
        // First get all the online devices that belong to this user, store in the onlineDevices list
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
        //-------------------------------------------------------------------------------------------------------------------
        // Next we track last time this user log the energy usage, then we add 7 days to it, simulate a week have passed
            const lastLog = await prisma.EnergyUse.findFirst({
              where: { UserID: data.userID },
              orderBy: { Timestamp: "desc" }, // Get the most recent log
              select: { Timestamp: true }
            });

            let newTimestamp = new Date();
            if (lastLog && lastLog.Timestamp) {
              newTimestamp = new Date(lastLog.Timestamp);
              newTimestamp.setDate(newTimestamp.getDate() + 7); // Add 7 days
            }
      

        //-------------------------------------------------------------------------------------------------------------------
        // Generate the simulated energy logs for the week for all online devices
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
                  Timestamp: newTimestamp,
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
          };
//-------------------------------------------------------------------------------------------------------------------
        case "simulateDailyUsage":
          const onlineDevices2 = await prisma.Devices.findMany({
            where: {
              UserID: data.userID,
              Status: "Online",
            },
            select: {
              DeviceID: true,
              DeviceType: true,
            },
          });
          if (onlineDevices2.length === 0) {
              console.log("No online devices found.");
              return res.status(200).json({ message: "No online devices found, skipping simulation." });
          }

          const lastLog2 = await prisma.EnergyUse.findFirst({
            where: { UserID: data.userID },
            orderBy: { Timestamp: "desc" }, 
            select: { Timestamp: true }
          });

          let newTimestamp2 = new Date();
          if (lastLog2 && lastLog2.Timestamp) {
            newTimestamp2 = new Date(lastLog2.Timestamp);
            newTimestamp2.setDate(newTimestamp2.getDate() + 1); // Add 1 day
          }

          const energyLogs2 = onlineDevices2.map((device) => {
            console.log("Processing device:", device);
            const deviceTypeKey = device.DeviceType.toLowerCase();

            if (!energyUsageMap[deviceTypeKey] || !dailyUsagePatternMap[deviceTypeKey]) {
              console.error(`Device type ${device.DeviceType} is missing in energy usage maps.`);
              return null; // Skip if type is not found in the map
            }

            const energyUsed = energyUsageMap[device.DeviceType.toLowerCase()];
            const dailyUsage = dailyUsagePatternMap[device.DeviceType.toLowerCase()];
            const dailyEnergyUsed = energyUsed * dailyUsage;
  
            return {
              DeviceID: device.DeviceID,
              UserID: data.userID,
              MachineID: data.machineID,
              Timestamp: newTimestamp2,
              EnergyUsed: dailyEnergyUsed,
            };
          });

          console.log("Generated Energy Logs:", energyLogs2);
          if (energyLogs2.length > 0) {
              await prisma.EnergyUse.createMany({ data: energyLogs2 });
              console.log("Energy logs inserted successfully.");
              return res.status(201).json({ message: "Daily energy usage simulated successfully" });
          } else {
              console.log("No valid energy logs to insert.");
              return res.status(200).json({ message: "No energy logs to insert" });
          };
      
//-------------------------------------------------------------------------------------------------------------------
        default:
                return res.status(400).json({ message: "Invalid action" });

    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
