import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const { action, ...data } = req.body;

    switch (action) {
      case "add":
          const typeMapping = {
            coffee: "Coffee_Machine",
            speaker: "Speaker",
            lightbulb: "Light",
            thermostat: "Thermostat",
            robot: "Robot",
            other: "Other",
        };
        const prismaDeviceType = typeMapping[data.deviceType];
        const newDevice = await prisma.Devices.create({
          data: {
            UserID: data.userID,
            RoomID: data.roomID,
            DeviceName: data.deviceName,
            DeviceType: prismaDeviceType,
            Status: "Offline",
            EnergyUsed: "0",
          },
        });
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Added device: ${data.deviceName}`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(201).json({ message: "Device added successfully", device: newDevice });

      case "get":
        const devices = await prisma.Devices.findMany({
          where: { UserID: data.userID, RoomID: data.roomID },
          select: { DeviceID: true, DeviceName: true, DeviceType: true, Status: true },
        });

        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `User fetched devices`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ devices });

      case "updateStatus":
        await prisma.Devices.update({
          where: { DeviceID: data.deviceID },
          data: { Status: data.newStatus },
        });
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

      case "updateName":
        if (!data.deviceID || typeof data.newDeviceName !== "string" || !data.newDeviceName.trim()) {
            return res.status(400).json({ message: "Device ID and valid new device name are required" });
        }
        await prisma.Devices.update({
          where: { DeviceID: data.deviceID },
          data: { DeviceName: data.newDeviceName.trim() },
        });
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Updated device name for ID "${data.deviceID}" to "${data.newDeviceName.trim()}"`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ message: "Device name updated successfully" });

      case "remove":
        await prisma.Devices.delete({
          where: { DeviceID: data.deviceID },
        });
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
