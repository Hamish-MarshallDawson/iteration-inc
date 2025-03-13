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
        return res.status(201).json({ message: "Device added successfully", device: newDevice });

      case "get":
        const devices = await prisma.Devices.findMany({
          where: { UserID: data.userID, RoomID: data.roomID },
          select: { DeviceID: true, DeviceName: true, DeviceType: true, Status: true },
        });
        return res.status(200).json({ devices });

      case "updateStatus":
        await prisma.Devices.update({
          where: { DeviceID: data.deviceID },
          data: { Status: data.newStatus },
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
        return res.status(200).json({ message: "Device name updated successfully" });

      case "remove":
        await prisma.Devices.delete({
          where: { DeviceID: data.deviceID },
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
