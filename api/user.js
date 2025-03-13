import { prisma } from "./globalPrisma.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    const { action, ...data } = req.body;

    switch (action) {

      case "register":
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.Users.create({
          data: { 
            FirstName: data.firstName,
            LastName: data.lastName,
            Email: data.email,
            Password: hashedPassword,
            EnergyGoal: 100,
            UserType: "Home_Dweller", 
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
        return res.status(200).json({ message: "Password reset successfully" });

      case "updateEmail":
        const user2 = await prisma.Users.findFirst({
          where: { Email: data.oldEmail },
        });
        await prisma.Users.update({
          where: { UserID: user2.UserID  },
          data: { Email: data.newEmail },
        });
        return res.status(200).json({ message: "Email updated successfully" });

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
