import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    // Extract the action and data from the request body
    const { action, ...data } = req.body;

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

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
