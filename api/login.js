// Import shared Prisma client
import { prisma } from "./globalPrisma.js";
// Import bcrypt for password hashing and comparison
import bcrypt from "bcryptjs"; 

export default async function handler(req, res) {

  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Search for a user in the "Users" table by the email they inputted
    const user = await prisma.Users.findFirst({
      where: { Email: email }, 
    });

    // Case when this user dont exist in the database
    if (!user) {
      return res.status(401).json({ message: "Email do not exist" });
    }

    // Retrieve the stored password from the database
    const storedPassword = user.Password;
    // Boolean flag to check if password match
    let isMatch = false;


    // Check if the stored password is hashed (as bcrypt hashe are always 60 characters long)
    if (storedPassword.length === 60) {
      // Compare input with hashed password
      isMatch = await bcrypt.compare(password, storedPassword); 
    } else {
      // Compare plaintext password (old database entries that havent been hashed)
      isMatch = (password === storedPassword); 
    }

    // If password doesn't match, return an error response
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If login is successful, return a success response with user email
    res.status(200).json({ message: "Login successful", user: { email: user.Email } });

  } catch (error) {
    // Return a generic internal server error response
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
