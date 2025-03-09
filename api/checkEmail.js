// Import shared Prisma client
import { prisma } from "./globalPrisma.js"; 


export default async function handler(req, res) {
  try {

    // Extract the email from the request body
    const { email } = req.body; 

    // Query the database to check if a user with the given email already exists
    const existingUser = await prisma.Users.findFirst({
      where: { Email: email },
    });
    
    // If the user exists, return a 400 response
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If the email is not found in the database, return a 200 response 
    return res.status(200).json({ message: "Email available" });
    
  } catch (error) {
    // Log any database-related errors to the server console
    // For debugg purpose on vercel
    console.error("Database Error:", error);

    // Return a generic 500 Internal Server Error response to the client
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
