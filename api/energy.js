import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {

    const { action, ...data} = req.body;

    // Define the energy usage and daily usage pattern for each device type
    const energyUsageMap = {
        coffee_machine: 100, //30s consumption
        speaker: 50,        //1h consumption
        light: 10,          //1h consumption
        thermostat: 50,    //1h consumption
        robot: 80,         //1h consumption
        other: 50,         //1h consumption
      };

    // Define the daily usage pattern for each device type
    const dailyUsagePatternMap = {
      coffee_machine: 0.5, //30m usage per day
      speaker: 3,        //3h usage per day
      light: 6,          //6h usage per day
      thermostat: 20,    //20h usage per day
      robot: 4,         //4h usage per day
      other: 5,         //5h usage per day
    };

    // Function to update the total energy usage for a device
    async function updateDeviceEnergyUsage(deviceID, energyToAdd) {
      const device = await prisma.Devices.findUnique({
          where: { DeviceID: deviceID },
          select: { EnergyUsed: true },
      });
  
      // Convert existing energy to number (default to 0 if null)
      const currentEnergy = device?.EnergyUsed ? parseInt(device.EnergyUsed, 10) : 0;
      const updatedEnergy = currentEnergy + energyToAdd;
  
      // Update energy usage in Devices table, converting back to string
      await prisma.Devices.update({
          where: { DeviceID: deviceID },
          data: { EnergyUsed: updatedEnergy.toString() },
      });
    }

    switch (action){
 //----------------------------------------Mannually Log---------------------------------------------------------------
        case "increment":
            // Get energy use based on device type
            const energyUsed = energyUsageMap[data.deviceType.toLowerCase()];

            // Log the energy use
            await prisma.EnergyUse.create({
                data: {
                  DeviceID: data.deviceID,
                  UserID: data.userID,
                  Timestamp: new Date(),
                  EnergyUsed: energyUsed,
                  MachineID: data.machineID
                },
            });

            // Update total energy usage in Devices table
            await updateDeviceEnergyUsage(data.deviceID, energyUsed);
            
            return res.status(200).json({ message: "Energy Logged Successfully" });

//---------------------------------------Weekly Simulation---------------------------------------------------------------       
        case "simulateWeeklyUsage":
        
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

            // If no online devices found, skip the simulation
            if (onlineDevices.length === 0) {
                console.log("No online devices found.");
                return res.status(200).json({ message: "No online devices found, skipping simulation." });
            }
        //-------------------------------------------------------------------------------------------------------------------

            // Get the last log entry for this user
            const lastLog = await prisma.EnergyUse.findFirst({
              where: { UserID: data.userID },
              orderBy: { Timestamp: "desc" }, // Get the most recent log
              select: { Timestamp: true }
            });

            // Set the start timestamp for the simulation
            let startTimestamp  = new Date();
            // If there is a last log entry, set the start timestamp to the day after the last log
            if (lastLog && lastLog.Timestamp) {
              startTimestamp  = new Date(lastLog.Timestamp);
              startTimestamp .setDate(startTimestamp .getDate() + 1); // Add 1 days
            }
      

        //-------------------------------------------------------------------------------------------------------------------
            // Generate the simulated energy logs for the week for all online devices
            const energyLogs = [];
            const updatePromises = [];

            // Loop through each day of the week
            for (let i = 0; i < 7; i++) {
              // Calculate the current timestamp
              const currentTimestamp = new Date(startTimestamp);
              // Add the day offset
              currentTimestamp.setDate(startTimestamp.getDate() + i);
              
              // Loop through each online device
              onlineDevices.forEach((device) => {
                // Get the energy usage and daily usage pattern for this device type
                const deviceTypeKey = device.DeviceType.toLowerCase();
                if (!energyUsageMap[deviceTypeKey] || !dailyUsagePatternMap[deviceTypeKey]) {
                  console.error(`Device type ${device.DeviceType} is missing in energy usage maps.`);
                  return; // Skip if type is not found
                }
          
                // Calculate the daily energy usage for this device
                const energyUsed = energyUsageMap[deviceTypeKey];
                const dailyUsage = dailyUsagePatternMap[deviceTypeKey];
                const dailyEnergyUsed = energyUsed * dailyUsage;
          
                // Add the energy log entry to the list of logs
                energyLogs.push({
                  DeviceID: device.DeviceID,
                  UserID: data.userID,
                  MachineID: data.machineID,
                  Timestamp: currentTimestamp,
                  EnergyUsed: dailyEnergyUsed,
                });


              });
            }

          console.log("Generated Energy Logs:", energyLogs);

          // Insert the generated energy logs into the database
          if (energyLogs.length > 0) {
              await prisma.EnergyUse.createMany({ data: energyLogs });
              console.log("Energy logs inserted successfully.");
              return res.status(201).json({ message: "Weekly energy usage simulated successfully" });
          } else {
              console.log("No valid energy logs to insert.");
              return res.status(200).json({ message: "No energy logs to insert" });
          };

//-----------------------------------------Daily Simulation---------------------------------------------------------------
        case "simulateDailyUsage":
          // Get all online devices that belong to this user
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

          // If no online devices found, skip the simulation
          if (onlineDevices2.length === 0) {
              console.log("No online devices found.");
              return res.status(200).json({ message: "No online devices found, skipping simulation." });
          }

          // Get the last log entry for this user
          const lastLog2 = await prisma.EnergyUse.findFirst({
            where: { UserID: data.userID },
            orderBy: { Timestamp: "desc" }, 
            select: { Timestamp: true }
          });
          
          // Set the start timestamp for the simulation
          let newTimestamp2 = new Date();
          // If there is a last log entry, set the start timestamp to the day after the last log
          if (lastLog2 && lastLog2.Timestamp) {
            newTimestamp2 = new Date(lastLog2.Timestamp);
            newTimestamp2.setDate(newTimestamp2.getDate() + 1); // Add 1 day
          }

          // Generate the simulated energy logs for the day for all online devices
          const energyLogs2 = onlineDevices2.map((device) => {
            console.log("Processing device:", device);

            // Get the energy usage and daily usage pattern for this device type
            const deviceTypeKey = device.DeviceType.toLowerCase();
            if (!energyUsageMap[deviceTypeKey] || !dailyUsagePatternMap[deviceTypeKey]) {
              console.error(`Device type ${device.DeviceType} is missing in energy usage maps.`);
              return null; // Skip if type is not found in the map
            }

            // Calculate the daily energy usage for this device
            const energyUsed = energyUsageMap[device.DeviceType.toLowerCase()];
            const dailyUsage = dailyUsagePatternMap[device.DeviceType.toLowerCase()];
            const dailyEnergyUsed = energyUsed * dailyUsage;
            // Return the energy log entry
            return {
              DeviceID: device.DeviceID,
              UserID: data.userID,
              MachineID: data.machineID,
              Timestamp: newTimestamp2,
              EnergyUsed: dailyEnergyUsed,
            };
            
          });

          console.log("Generated Energy Logs:", energyLogs2);

          // Insert the generated energy logs into the database
          if (energyLogs2.length > 0) {
              await prisma.EnergyUse.createMany({ data: energyLogs2 });
              console.log("Energy logs inserted successfully.");
              return res.status(201).json({ message: "Daily energy usage simulated successfully" });
          } else {
              console.log("No valid energy logs to insert.");
              return res.status(200).json({ message: "No energy logs to insert" });
          };
      
//-------------------------------------Fetch and update total energy usage for device-----------------------------------------------------------------
        case "fetchTotalEnergyUsage":
          const  now = new Date();
          const energyLogs3 = await prisma.EnergyUse.findMany({
            where: {
              DeviceID: data.deviceID,
              Timestamp: { lte: now },  
            },
            select: { EnergyUsed: true },
          });
          const totalEnergyUsed = energyLogs3.reduce((sum, log) => sum + (parseInt(log.EnergyUsed)), 0);
          const totalEnergyUsedString = totalEnergyUsed.toString();

          await prisma.Devices.update({
            where: { DeviceID: data.deviceID },
            data: { EnergyUsed: totalEnergyUsedString },
          });

          return res.status(200).json({ totalEnergyUsed });
  
//-------------------------------------Fetch monthoy energy usage-----------------------------------------------------------------
        case "fetchMonthlyEnergyUsage":
          const now1 = new Date();
          const startOfMonth = new Date(now1.getFullYear(), now1.getMonth(), 1);

          const monthlyEnergyLogs = await prisma.EnergyUse.findMany({
            where: {
              UserID: data.userID,
              Timestamp: {
                gte: startOfMonth,  // From start of the month
                lte: now1,           // Until now
              },
            },
            select: { EnergyUsed: true },
          });

          const totalMonthlyEnergyUsed = monthlyEnergyLogs.reduce((sum, log) => sum + parseInt(log.EnergyUsed, 10), 0);
          return res.status(200).json({ totalMonthlyEnergyUsed});


        default:
                return res.status(400).json({ message: "Invalid action" });

    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
