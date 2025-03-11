// Import shared Prisma client
import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {
  try {

    // Extract the user's current email and the new email from the request 
    const { currentEmail, newEmail } = req.body;
    
    // Find the user by their current email
    const user = await prisma.Users.findFirst({
      where: { Email: currentEmail },
    });

    // Update the email using the UserID
    await prisma.Users.update({
      where: { UserID: user.UserID },
      data: { Email: newEmail },
    });

    return res.status(200).json({ message: "Email updated successfully" });

  } catch (error) {
    // Return a generic 500 Internal Server Error response to the client
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
