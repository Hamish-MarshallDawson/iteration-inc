import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    // Extract userid and roomid from the request body
    const { userID, roomID } = req.body;

    // Fetch devices owned by the user in the given room
    const devices = await prisma.Devices.findMany({
      where: { UserID: userID, RoomID: roomID },
      select: { DeviceID: true, DeviceName: true, DeviceType: true, Status: true }
    });

    return res.status(200).json({ devices });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
