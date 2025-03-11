// Import shared Prisma client
import { prisma } from "./globalPrisma.js";
// Import bcrypt for password hashing
import bcrypt from "bcryptjs"; 

export default async function handler(req, res) {
  try {
    // Extract the user's info from the request body
    const { email, newPassword } = req.body;
    // Hash the password before update on database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the user by email 
    const user = await prisma.Users.findFirst({
        where: { Email: email },
    });

    // If user dont exist
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    // Update password by using primary key userid
    await prisma.Users.update({
        where: { UserID: user.UserID },
        data: { Password: hashedPassword },
    });


    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    // If error happened, return a generic 500 Internal Server Error response to the client
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
