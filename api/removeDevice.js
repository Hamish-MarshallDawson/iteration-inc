// Import shared Prisma client
import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    const { deviceID } = req.body;

    // Ensure valid request
    if (!deviceID) {
      return res.status(400).json({ message: "Device ID is required" });
    }

    // Delete the device from the database
    await prisma.Devices.delete({
      where: { DeviceID: deviceID },
    });

    return res.status(200).json({ message: "Device removed successfully" });

  } catch (error) {
    console.error("Database Error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Device not found" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
