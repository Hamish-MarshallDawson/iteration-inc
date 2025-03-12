
import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const {deviceName, deviceType, roomID, userID } = req.body;

    // Need to map the device name we passed from because they name have small different
    const typeMapping = {
        coffee: "Coffee_Machine",
        speaker: "Speaker",
        lightbulb: "Light",
        thermostat: "Thermostat",
        robot: "Robot",
        other: "Other",
    };
    const prismaDeviceType = typeMapping[deviceType];

    // Add device to the Devices table
    const newDevice = await prisma.Devices.create({
      data: {
        UserID: userID,
        RoomID: roomID,
        DeviceName: deviceName,
        DeviceType: prismaDeviceType,
        Status: "Offline", // Default
        EnergyUsed: "0", // Default
      },
    });


    return res.status(201).json({ message: "Device added successfully", device: newDevice });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
