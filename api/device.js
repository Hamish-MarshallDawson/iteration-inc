import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    // Extract the action and data from the request body
    const { action, ...data } = req.body;
    console.log(action);

    switch (action) {
      //----------------------------------------Device add------------------------------------------------------  
      case "add":

        const typeMapping = {
          coffee: "Coffee_Machine",
          speaker: "Speaker",
          lightbulb: "Light",
          thermostat: "Thermostat",
          robot: "Robot",
          other: "Other",
        };
        // Map the device type to the corresponding value in the database
        const prismaDeviceType = typeMapping[data.deviceType];

        const newDevice = await prisma.Devices.create({   // Create a new device
          data: {
            UserID: data.userID,
            RoomID: data.roomID,
            DeviceName: data.deviceName,
            DeviceType: prismaDeviceType,
            Status: "Offline",
            EnergyUsed: "0",
          },
        });

        // Log the device addition event
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Added device: ${data.deviceName}`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });

        let startTimestamp = new Date();
        let endTimeStamp = new Date();
        endTimeStamp.setDate(startTimestamp.getDate() + 7);
        await prisma.Schedules.create({
          data: {
              DeviceID: newDevice.DeviceID,
              UserID: data.userID,
              Frequency: "Weekly",
              StartTime: startTimestamp,
              EndTime: endTimeStamp,
          },
        });

        return res.status(201).json({ message: "Device added successfully", device: newDevice });

      //----------------------------------------Devices get------------------------------------------------------ 
      case "get":
        // Fetch all devices for the user in the specified room
        const devices = await prisma.Devices.findMany({
          where: { UserID: data.userID, RoomID: data.roomID },
          select: { DeviceID: true, DeviceName: true, DeviceType: true, Status: true },
        });

        // Log the device fetch event
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `User fetched devices`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });

        // Return the list of devices
        return res.status(200).json({ devices });

      //----------------------------------------Devices toggle------------------------------------------------------ 
      case "updateStatus":
        await prisma.Devices.update({   // Update the device status
          where: { DeviceID: data.deviceID },
          data: { Status: data.newStatus },
        });
        // Log the device status update event
        await prisma.UserActivity.create({
          data: {
            UserID: data.userID,
            DeviceID: data.deviceID.toString(),
            Timestamp: new Date(),
            Action: data.newStatus === "Online" ? "Turn_On" : "Turn_Off",
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ message: "Device status updated successfully" });

      //----------------------------------------Devices update name------------------------------------------------------ 
      case "updateName":
        // Validate the device ID and new device name
        if (!data.deviceID || typeof data.newDeviceName !== "string" || !data.newDeviceName.trim()) {
          return res.status(400).json({ message: "Device ID and valid new device name are required" });
        }
        // Update the device name
        await prisma.Devices.update({
          where: { DeviceID: data.deviceID },
          data: { DeviceName: data.newDeviceName.trim() },
        });
        // Log the device name update event
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Updated device name for ID "${data.deviceID}" to "${data.newDeviceName.trim()}"`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ message: "Device name updated successfully" });

      //----------------------------------------Devices remove------------------------------------------------------ 
      case "remove":
        // Delete all related data for the device
        await prisma.EnergyUse.deleteMany({ where: { DeviceID: data.deviceID } });
        await prisma.UserActivity.deleteMany({ where: { DeviceID: data.deviceID.toString() } });
        await prisma.Recommendations.deleteMany({ where: { DeviceID: data.deviceID } });
        await prisma.Schedules.deleteMany({ where: { DeviceID: data.deviceID } });
        // Delete the device
        await prisma.Devices.delete({
          where: { DeviceID: data.deviceID },
        });
        // Log the device removal event
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Removed device ID: ${data.deviceID}`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ message: "Device removed successfully" });

      //----------------------------------------Devices Automation Rule Fetch------------------------------------------------------
      case "fetchSchedule":
        const existingSchedule = await prisma.Schedules.findFirst({
          where: { DeviceID: data.deviceID, UserID: data.userID },
          select: { Frequency: true, StartTime: true, EndTime: true },
        });

        return res.status(200).json({ schedule: existingSchedule });



      //----------------------------------------Devices Automation Rule Update------------------------------------------------------
      case "updateSchedule":
        
        const existingSchedule2 = await prisma.Schedules.findFirst({
          where: { DeviceID: data.deviceID, UserID: data.userID },
        });
        
        if (existingSchedule2) {
          // If schedule exists, update it
          await prisma.Schedules.updateMany({
            where: { DeviceID: data.deviceID, UserID: data.userID },
            data: {
              Frequency: data.frequency,
              StartTime: new Date(data.startTime),
              EndTime: new Date(data.endTime),
            },
          });
          return res.status(200).json({ message: "Schedule updated successfully" });
        } else {
          // If no schedule exists, create a new one
          await prisma.Schedules.create({
            data: {
              DeviceID: data.deviceID,
              UserID: data.userID,
              Frequency: data.frequency,
              StartTime: new Date(data.startTime),
              EndTime: new Date(data.endTime),
            },
          });
          return res.status(201).json({ message: "New schedule created successfully" });
        }

      //----------------------------------------Devices Energy Fetch------------------------------------------------------
      case "fetchEnergyUsage":
        const device = await prisma.Devices.findUnique({
          where: { DeviceID: data.deviceID },
          select: { EnergyUsed: true },
        });
        if (!device) {
          return res.status(404).json({ message: "Device not found" });
        }
        return res.status(200).json({ energyUsed: device.EnergyUsed});
      
      case "activateSchedule":
        // Fetch all schedules bind to this user
        const schedules = await prisma.Schedules.findMany({
          where: {
            UserID: data.userID,
          },
          include: {
            Devices: true,
          },
        });

        // Get the current time
        const now = new Date();

        // Loop through all schedules
        for (const schedule of schedules) {

          // Skip schedules with missing start or end times
          if (!schedule.StartTime || !schedule.EndTime) continue;

          // Extract the schedule details
          const { DeviceID, Frequency, StartTime, EndTime } = schedule;
          
          // Check if the current time is between the start and end times
          if (StartTime <= now && now <= EndTime) {
            await prisma.Devices.update({
              where: { DeviceID },
              data: { Status: "Online" },
            });
      
            await prisma.UserActivity.create({
              data: {
                UserID: data.userID,
                DeviceID: DeviceID.toString(),
                Timestamp: now,
                Action: "Turn_On",
                MachineID: data.machineID,
              },
            });
          }

          // Check if the current time is past the end time
          if (EndTime < now) {
            await prisma.Devices.update({
              where: { DeviceID },
              data: { Status: "Offline" },
            });
      
            await prisma.UserActivity.create({
              data: {
                UserID: data.userID,
                DeviceID: DeviceID.toString(),
                Timestamp: now,
                Action: "Turn_Off",
                MachineID: data.machineID,
              },
            });
          }


          // Update the schedule status based on the freq after activate it 
          const nextStart = new Date(StartTime);
          const nextEnd = new Date(EndTime);
          switch (Frequency) {
            case "Daily":
              nextStart.setDate(nextStart.getDate() + 1);
              nextEnd.setDate(nextEnd.getDate() + 1);
              break;
            case "Weekly":
              nextStart.setDate(nextStart.getDate() + 7);
              nextEnd.setDate(nextEnd.getDate() + 7);
              break;
            case "Monthly":
              nextStart.setMonth(nextStart.getMonth() + 1);
              nextEnd.setMonth(nextEnd.getMonth() + 1);
              break;
            case "Once":
            default:
              continue; 
          }
          await prisma.Schedules.update({
            where: { ScheduleID: schedule.ScheduleID },
            data: {
              StartTime: nextStart,
              EndTime: nextEnd,
            },
          });


        }

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
