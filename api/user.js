import { prisma } from "./globalPrisma.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    const { action, ...data } = req.body;

    switch (action) {

      case "register":
        const hashedPassword = await bcrypt.hash(data.password, 10);

        let machine = await prisma.Machines.findFirst({
          where: { MachineSerialCode: data.machineSerialCode },
        });
        if (!machine) {
          machine = await prisma.Machines.create({
            data: {
              MachineSerialCode: data.machineSerialCode,
              MachineName: `${data.firstName}'s ${data.machineName}` || "Unknown Device",
            },
          });
        }

        const newUser = await prisma.Users.create({
          data: { 
            FirstName: data.firstName,
            LastName: data.lastName,
            Email: data.email,
            Password: hashedPassword,
            EnergyGoal: 15,
            UserType: "Home_Dweller", 
            MachineID: machine.MachineID
        },
        });

        await prisma.SecurityLogs.create({
          data: {
            UserID: newUser.UserID,
            EventDescription: `New user registered (${newUser.Email})`,
            Timestamp: new Date(),
            MachineID: machine.MachineID
          },
        });

        return res.status(201).json({ message: "User registered successfully", user: newUser });

      case "checkEmail":
        const existingUser = await prisma.Users.findFirst({ 
            where: { Email: data.email } 
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(200).json({  message: "Email available" });

      case "resetPassword":
        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
        const user = await prisma.Users.findFirst({
          where: { Email: data.email },
        });
        await prisma.Users.update({
          where: { UserID: user.UserID },
          data: { Password: hashedNewPassword },
        });

        await prisma.SecurityLogs.create({
          data: {
            UserID: user.UserID,
            EventDescription: `User reset password (${user.Email})`,
            Timestamp: new Date(),
            MachineID: user.MachineID
          },
        });
        return res.status(200).json({ message: "Password reset successfully" });

      case "updateEmail":
        const user2 = await prisma.Users.findFirst({
          where: { Email: data.oldEmail },
        });
        await prisma.Users.update({
          where: { UserID: user2.UserID  },
          data: { Email: data.newEmail },
        });
        await prisma.SecurityLogs.create({
          data: {
            UserID: user2.UserID,
            EventDescription: `User updated email from ${data.oldEmail} to ${data.newEmail}`,
            Timestamp: new Date(),
            MachineID: user2.MachineID
          },
        });
        return res.status(200).json({ message: "Email updated successfully" });
      case "getEnergyGoal":
        // Fetch the user's energy goal
        const user3 = await prisma.Users.findUnique({
          where: { UserID: data.userID },
          select: { EnergyGoal: true }
        });
        return res.status(200).json({ energyGoal: user3.EnergyGoal });

      case "updateEnergyGoal":
        await prisma.users.update({
          where: { UserID: data.userID },
          data: { EnergyGoal: data.newEnergyGoal },
        });
        return res.status(200).json({ message: "Energy goal updated successfully" });

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
