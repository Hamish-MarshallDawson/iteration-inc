import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {
    
    const { action,userID, machineID } = req.body;

    switch (action) {
    //----------------------------------------Logged in Users------------------------------------------------------ 
        case "getLoggedUsers":
            const loggedUsers = await prisma.Users.findMany({       
                where: { MachineID: machineID },
                select: { UserID: true, FirstName: true, LastName: true, Email: true, MachineID: true },
            });
            return res.status(200).json({ users: loggedUsers });

    //----------------------------------------Activities Logs------------------------------------------------------ 
        case "getUserActivityLogs":
            const activityLogs = await prisma.UserActivity.findMany({
                where: { MachineID: machineID }, 
                orderBy: { Timestamp: "desc" },
            });
            return res.status(200).json({ logs: activityLogs });
    
     //----------------------------------------Energy Logs------------------------------------------------------ 
        case "getEnergyUseLogs":
            const energyLogs = await prisma.EnergyUse.findMany({
                where: { MachineID: machineID }, 
                orderBy: { Timestamp: "desc" },
            });
            return res.status(200).json({ logs: energyLogs });
    
     //----------------------------------------Devices ------------------------------------------------------ 
        case "getDevicesInMachine":
            const usersInMachine = await prisma.Users.findMany({
                where: { MachineID: machineID },
                select: { UserID: true }
            });
            const userIDs = usersInMachine.map(user => user.UserID);
            const devices = await prisma.Devices.findMany({
                where: { UserID: { in: userIDs } },
                select: { DeviceID: true, DeviceName: true, DeviceType: true, Status: true }
            });
            return res.status(200).json({ devices });
    
     //----------------------------------------Security Logs------------------------------------------------------ 
        case "getSecurityLogs":
            const securityLogs = await prisma.SecurityLogs.findMany({
                where: { MachineID: machineID },
                orderBy: { Timestamp: "desc" }
            });
            return res.status(200).json({ logs: securityLogs });

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
