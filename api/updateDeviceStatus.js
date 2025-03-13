import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    // Extract deviceID and newStatus from the request body
    const { deviceID, newStatus } = req.body;
    
    // Update the device status in the database
    await prisma.Devices.update({
      where: { DeviceID: deviceID },
      data: { Status: newStatus },
    });

    return res.status(200).json({ message: "Device status updated successfully" });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
