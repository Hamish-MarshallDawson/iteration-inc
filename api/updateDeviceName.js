// Import shared Prisma client
import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {

    // Extract deviceid and new name from the request body
    const { deviceID, newDeviceName } = req.body;
    
    // Validate inputs
    if (!deviceID || typeof newDeviceName !== "string" || !newDeviceName.trim()) {
        return res.status(400).json({ message: "Device ID and valid new device name are required" });
        }

    // Update the device name in the database
    const updatedDevice = await prisma.Devices.update({
        where: { DeviceID: deviceID },
        data: { DeviceName: newDeviceName.trim() },
      });
      
    return res.status(200).json({ message: "Device name updated successfully", device: updatedDevice });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
